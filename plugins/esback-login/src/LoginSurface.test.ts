import { SignInProviderConfig } from '@backstage/core-components';
import { LoginSurface, Provider } from './LoginSurface';
import { MockConfigApi } from '@backstage/test-utils';
import { createApiRef } from '@backstage/core-plugin-api';

describe('LoginSurface', () => {
  describe('hasProviders', () => {
    it('returns false if there are no providers', () => {
      const loginSurface = new LoginSurface();

      expect(loginSurface.hasProviders()).toEqual(false);
    });

    it('returns true if there is at least 1 provider', () => {
      const loginSurface = new LoginSurface();

      loginSurface.add({
        config: 'guest',
        enabled: () => true,
        authProviderKey: 'guest'
      });

      expect(loginSurface.hasProviders()).toEqual(true);
    });
  });

  describe('enabledProviders', () => {
    it('returns the provider configs with custom message and title specified in auth:loginPage:provider', () => {
      const loginSurface = new LoginSurface();
      const mockProviderConfig: SignInProviderConfig = {
        id: 'test-mock-auth-provider',
        title: 'original title',
        message: 'original message',
        apiRef: createApiRef({
          id: 'esback.auth.mock',
        })
      }

      const mockProvider: Provider = {
        config: mockProviderConfig,
        enabled: () => true,
        authProviderKey: 'mock'
      }

      const mockAppConfig = new MockConfigApi({
        app: { baseUrl: 'https://example.com' },
        auth: {
          loginPage: {
            mock: {
              id: 'modified-mock-auth-provider',
              title: 'custom title',
              message: 'custom message'
            }
          }
        },
      });

      loginSurface.add(mockProvider);

      const enabledProviders = loginSurface.enabledProviders(mockAppConfig)

      expect(enabledProviders).toEqual([{
        id: 'modified-mock-auth-provider',
        title: 'custom title',
        message: 'custom message',
        apiRef: createApiRef({
          id: 'esback.auth.mock',
        })
      }])
    });

    it('returns the provider configs for enabled providers', () => {
      const loginSurface = new LoginSurface();
      loginSurface.add({
        config: 'guest',
        enabled: () => true,
        authProviderKey: 'guest'
      });
      const mockConfig = new MockConfigApi({
        app: { baseUrl: 'https://example.com' },
      });

      expect(loginSurface.enabledProviders(mockConfig)).toEqual(['guest']);
    });

    it('does not return provider configs for providers that are not enabled', () => {
      const loginSurface = new LoginSurface();
      loginSurface.add({
        config: 'guest',
        enabled: () => false,
        authProviderKey: 'guest'
      });
      const mockConfig = new MockConfigApi({
        app: { baseUrl: 'https://example.com' },
      });

      expect(loginSurface.enabledProviders(mockConfig)).toEqual([]);
    });
  });
});
