import { stringifyEntityRef } from '@backstage/catalog-model';
import {
  AuthResolverContext,
  OAuthHandlers,
  OAuthResponse,
  OAuthStartRequest,
  OAuthStartResponse,
  OAuthState,
  encodeState,
  readState,
} from '@backstage/plugin-auth-backend';
import {
  Metadata,
  StateStoreStoreCallback,
  StateStoreVerifyCallback,
  Strategy as OAuth2Strategy,
  VerifyCallback,
} from 'passport-oauth2';
import express from 'express';
import passport from 'passport';
import jwtDecoder from 'jwt-decode';

export class VMwareCloudServicesAuthProvider implements OAuthHandlers {
  private readonly clientId: string;
  private readonly callbackUrl: string;
  private readonly _strategy: passport.Strategy;
  private readonly resolverContext: AuthResolverContext;

  constructor(options: {
    clientId: string;
    callbackUrl: string;
    resolverContext: AuthResolverContext;
  }) {
    this.clientId = options.clientId;
    this.callbackUrl = options.callbackUrl;
    this.resolverContext = options.resolverContext;
    this._strategy = new OAuth2Strategy(
      {
        clientID: this.clientId,
        clientSecret: '',
        callbackURL: this.callbackUrl,
        authorizationURL:
          'https://console.cloud.vmware.com/csp/gateway/discovery',
        tokenURL:
          'https://console.cloud.vmware.com/csp/gateway/am/api/auth/token',
        pkce: true,
        state: true,
        customHeaders: {
          Authorization: `Basic ${Buffer.from(`${options.clientId}:`).toString(
            'base64',
          )}`,
        },
        scope: 'openid offline_access',
      },
      (
        _accessToken: string,
        refreshToken: string,
        params: { id_token: string },
        _profile: passport.Profile,
        done: VerifyCallback,
      ) => {
        done(undefined, params, { refreshToken });
      },
    );
    const pkceSessionStore = Object.create((this._strategy as any)._stateStore);
    (this._strategy as any)._stateStore = {
      verify(req: Request, state: string, callback: StateStoreVerifyCallback) {
        pkceSessionStore.verify(
          req,
          (readState(state) as any).handle,
          callback,
        );
      },
      store(
        req: OAuthStartRequest,
        verifier: string,
        state: string,
        meta: Metadata,
        callback: StateStoreStoreCallback,
      ) {
        pkceSessionStore.store(
          req,
          verifier,
          state,
          meta,
          (err: Error, handle: string) => {
            callback(err, encodeState({ handle, ...req.state } as OAuthState));
          },
        );
      },
    };
  }

  start(oauthStartRequest: OAuthStartRequest): Promise<OAuthStartResponse> {
    return new Promise((resolve, reject) => {
      const strategy = Object.create(this._strategy);

      strategy.redirect = (url: string, status?: number) => {
        resolve({ url, status: status ?? undefined });
      };
      strategy.error = (error: Error) => {
        reject(error);
      };
      strategy.authenticate(oauthStartRequest);
    });
  }

  async handler(
    req: express.Request,
  ): Promise<{ response: OAuthResponse; refreshToken?: string }> {
    return new Promise((resolve, reject) => {
      const strategy = Object.create(this._strategy);

      strategy.success = (
        user: { id_token: string },
        info: { refreshToken: string },
      ) => {
        const identity: Record<string, string> = jwtDecoder(user.id_token);
        this.resolverContext
          .signInWithCatalogUser({
            filter: {
              'spec.profile.email': identity.email,
            },
          })
          .catch(_ => {
            const userEntityRef = stringifyEntityRef({
              kind: 'User',
              name: identity.email,
            });
            return this.resolverContext.issueToken({
              claims: {
                sub: userEntityRef,
                ent: [userEntityRef],
              },
            });
          })
          .then(backstageIdentity => {
            resolve({
              response: {
                profile: {
                  displayName: `${identity.given_name} ${identity.family_name}`,
                  email: identity.email,
                },
                providerInfo: {
                  idToken: user.id_token,
                  accessToken: '',
                  scope: '',
                },
                backstageIdentity,
              },
              refreshToken: info.refreshToken,
            });
          });
      };
      strategy.fail = (
        info: { type: 'success' | 'error'; message?: string },
      ) => {
        reject(new Error(`Authentication rejected, ${info.message ?? ''}`));
      };
      strategy.error = (error: Error) => {
        reject(error);
      };
      strategy.redirect = () => {
        reject(new Error('Unexpected redirect'));
      };

      strategy.authenticate(req);
    });
  }
}
