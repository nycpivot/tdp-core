import { OAuthStartRequest } from '@backstage/plugin-auth-backend';
import { VMwareCloudServicesAuthProvider } from './provider';

describe('VMwareCloudServicesAuthProvider', () => {
  describe('#start', () => {
    let startRequest: OAuthStartRequest;
    let fakeSession: Record<string, any>;
    let provider: VMwareCloudServicesAuthProvider;

    beforeEach(() => {
      fakeSession = {};
      startRequest = {
        query: {},
        session: fakeSession,
      } as unknown as OAuthStartRequest;
      provider = new VMwareCloudServicesAuthProvider({
        clientId: 'placeholderClientId',
        callbackUrl: 'http://callbackUrl',
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

    it('passes callback URL', async () => {
      const startResponse = await provider.start(startRequest);
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('redirect_uri')).toBe('http://callbackUrl');
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
  });
});
