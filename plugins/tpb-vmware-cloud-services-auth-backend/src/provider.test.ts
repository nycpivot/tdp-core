import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { NotFoundError } from '@backstage/errors';
import {
  AuthResolverContext,
  OAuthRefreshRequest,
  OAuthStartRequest,
  OAuthState,
  encodeState,
} from '@backstage/plugin-auth-backend';
import express from 'express';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import nJwt from 'njwt';
import { VMwareCloudServicesAuthProvider } from './provider';

jest.mock('uid2', () => jest.fn().mockReturnValue('sessionid'));

describe('VMwareCloudServicesAuthProvider', () => {
  const server = setupServer();
  setupRequestMockHandlers(server);
  const idToken: string = nJwt
    .create(
      {
        given_name: 'Givenname',
        family_name: 'Familyname',
        email: 'user@example.com',
      },
      Buffer.from('signing key'),
    )
    .compact();

  let provider: VMwareCloudServicesAuthProvider;

  beforeEach(() => {
    server.use(
      rest.post(
        'https://console.cloud.vmware.com/csp/gateway/am/api/auth/token',
        (req, res, ctx) =>
          res(
            req.headers.get('Authorization')
              ? ctx.json({
                  access_token: 'accessToken',
                  refresh_token: 'refreshToken',
                  id_token: idToken,
                })
              : ctx.status(401),
          ),
      ),
    );
  });

  describe('#start', () => {
    let startRequest: OAuthStartRequest;
    let fakeSession: Record<string, any>;

    beforeEach(() => {
      fakeSession = {};
      startRequest = {
        query: {},
        session: fakeSession,
      } as unknown as OAuthStartRequest;
      provider = new VMwareCloudServicesAuthProvider({
        clientId: 'placeholderClientId',
        callbackUrl: 'http://callbackUrl',
        resolverContext: {
          issueToken: jest.fn(),
          findCatalogUser: jest.fn(),
          signInWithCatalogUser: jest.fn().mockResolvedValue({
            token: 'token',
          }),
        },
      });
    });

    it('redirects to the Cloud Services Console consent page', async () => {
      const startResponse = await provider.start(startRequest);
      const url = new URL(startResponse.url);

      expect(url.protocol).toBe('https:');
      expect(url.hostname).toBe('console.cloud.vmware.com');
      expect(url.pathname).toBe('/csp/gateway/discovery');
    });

    it('passes client ID from config', async () => {
      const startResponse = await provider.start(startRequest);
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('client_id')).toBe('placeholderClientId');
    });

    it('passes organizationId from config', async () => {
      provider = new VMwareCloudServicesAuthProvider({
        clientId: 'placeholderClientId',
        callbackUrl: 'http://callbackUrl',
        resolverContext: {
          issueToken: jest.fn(),
          findCatalogUser: jest.fn(),
          signInWithCatalogUser: jest.fn().mockResolvedValue({
            token: 'token',
          }),
        },
        organizationId: 'orgId',
      });

      const startResponse = await provider.start(startRequest);
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('orgId')).toBe('orgId');
    });

    it('uses default org when organizationId is not configured', async () => {
      const startResponse = await provider.start(startRequest);
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('orgId')).toBeNull();
    });

    it('passes callback URL', async () => {
      const startResponse = await provider.start(startRequest);
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('redirect_uri')).toBe('http://callbackUrl');
    });

    it('requests scopes for ID and refresh token', async () => {
      const startResponse = await provider.start(startRequest);
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('scope')).toBe('openid offline_access');
    });

    it('generates PKCE challenge', async () => {
      const startResponse = await provider.start(startRequest);
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('code_challenge_method')).toBe('S256');
      expect(searchParams.get('code_challenge')).not.toBeNull();
    });

    it('stores PKCE verifier in session', async () => {
      await provider.start(startRequest);
      expect(
        fakeSession['oauth2:console.cloud.vmware.com'].state.code_verifier,
      ).toBeDefined();
    });

    it('fails when request has no session', () => {
      return expect(
        provider.start({ query: {} } as unknown as OAuthStartRequest),
      ).rejects.toThrow('requires session support');
    });

    it('adds session ID handle to state param', async () => {
      const startResponse = await provider.start(startRequest);
      const stateParam = new URL(startResponse.url).searchParams.get('state');
      const state = Object.fromEntries(
        new URLSearchParams(Buffer.from(stateParam!, 'hex').toString('utf-8')),
      );

      const { handle } = fakeSession['oauth2:console.cloud.vmware.com'].state;
      expect(state.handle).toBe(handle);
    });
  });

  describe('#handler', () => {
    let resolverContext: jest.Mocked<AuthResolverContext>;
    let handlerRequest: express.Request;

    beforeEach(() => {
      resolverContext = {
        issueToken: jest.fn().mockResolvedValue({
          token: 'defaultBackstageToken',
        }),
        findCatalogUser: jest.fn(),
        signInWithCatalogUser: jest.fn().mockResolvedValue({
          token: 'backstageToken',
        }),
      };
      provider = new VMwareCloudServicesAuthProvider({
        clientId: 'clientId',
        callbackUrl: 'http://callbackUrl',
        resolverContext,
      });
      handlerRequest = {
        query: {
          code: 'authorization_code',
          state: encodeState({
            handle: 'sessionid',
            nonce: 'nonce',
            env: 'development',
          } as OAuthState),
        },
        session: {
          ['oauth2:console.cloud.vmware.com']: {
            state: { handle: 'sessionid', code_verifier: 'foo' },
          },
        },
      } as unknown as express.Request;
    });

    it('stores refresh token in cookie', async () => {
      const { refreshToken } = await provider.handler(handlerRequest);

      expect(refreshToken).toBe('refreshToken');
    });

    it('responds with ID token', async () => {
      const { response } = await provider.handler(handlerRequest);

      expect(response.providerInfo.idToken).toBe(idToken);
    });

    it('decodes profile from ID token', async () => {
      const { response } = await provider.handler(handlerRequest);

      expect(response.profile).toStrictEqual({
        displayName: 'Givenname Familyname',
        email: 'user@example.com',
      });
    });

    // TODO what if the given_name, family_name, or email claims are missing
    // from the token!?

    it('looks up backstage identity by email', async () => {
      const { response } = await provider.handler(handlerRequest);

      expect(response.backstageIdentity!.token).toBe('backstageToken');
      expect(resolverContext.signInWithCatalogUser).toHaveBeenCalledWith({
        filter: {
          'spec.profile.email': 'user@example.com',
        },
      });
    });

    it('returns "fake" backstage identity when no entity matches', async () => {
      resolverContext.signInWithCatalogUser.mockRejectedValue(
        new NotFoundError('User not found'),
      );

      const { response } = await provider.handler(handlerRequest);

      expect(response.backstageIdentity!.token).toBe('defaultBackstageToken');
      expect(resolverContext.issueToken).toHaveBeenCalledWith({
        claims: {
          sub: 'user:default/user@example.com',
          ent: ['user:default/user@example.com'],
        },
      });
    });

    it('fails when resolver context throws other error', () => {
      const error = new Error('bizarre');
      resolverContext.signInWithCatalogUser.mockRejectedValue(error);

      return expect(provider.handler(handlerRequest)).rejects.toThrow(error);
    });

    it('fails when request has no session', () => {
      return expect(
        provider.handler({
          query: {
            code: 'authorization_code',
            state: encodeState({
              handle: 'sessionid',
              nonce: 'nonce',
              env: 'development',
            } as OAuthState),
          },
        } as unknown as express.Request),
      ).rejects.toThrow('requires session support');
    });

    it('fails when request has no authorization code', () => {
      return expect(
        provider.handler({
          query: {
            state: encodeState({
              handle: 'sessionid',
              nonce: 'nonce',
              env: 'development',
            } as OAuthState),
          },
          session: {
            ['oauth2:console.cloud.vmware.com']: {
              state: { handle: 'sessionid', code_verifier: 'foo' },
            },
          },
        } as unknown as express.Request),
      ).rejects.toThrow('Missing authorization code');
    });
  });

  describe('integration between #start and #handler', () => {
    it('state param is compatible', async () => {
      provider = new VMwareCloudServicesAuthProvider({
        clientId: 'placeholderClientId',
        callbackUrl: 'http://callbackUrl',
        resolverContext: {
          issueToken: jest.fn(),
          findCatalogUser: jest.fn(),
          signInWithCatalogUser: jest.fn().mockResolvedValue({
            token: 'token',
          }),
        },
      });

      const startResponse = await provider.start({
        query: {},
        session: {},
        state: { nonce: 'nonce', env: 'development' },
      } as unknown as OAuthStartRequest);
      const { searchParams } = new URL(startResponse.url);
      const { response } = await provider.handler({
        query: {
          code: 'authorization_code',
          state: searchParams.get('state'),
        },
        session: {
          ['oauth2:console.cloud.vmware.com']: {
            state: { handle: 'sessionid', code_verifier: 'foo' },
          },
        },
      } as unknown as express.Request);

      expect(response).toBeDefined();
    });
  });

  describe('#refresh', () => {
    it('gets new refresh token', async () => {
      provider = new VMwareCloudServicesAuthProvider({
        clientId: 'placeholderClientId',
        callbackUrl: 'http://callbackUrl',
        resolverContext: {
          issueToken: jest.fn(),
          findCatalogUser: jest.fn(),
          signInWithCatalogUser: jest.fn().mockResolvedValue({
            token: 'token',
          }),
        },
      });

      const { refreshToken } = await provider.refresh({
        refreshToken: 'oldRefreshToken',
      } as unknown as OAuthRefreshRequest);

      expect(refreshToken).toBe('refreshToken');
    });
  });

  it('decodes profile from ID token', async () => {
    const { response } = await provider.refresh({
      refreshToken: 'oldRefreshToken',
    } as unknown as OAuthRefreshRequest);

    expect(response.profile).toStrictEqual({
      displayName: 'Givenname Familyname',
      email: 'user@example.com',
    });
  });
});
