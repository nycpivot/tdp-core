import { SignInProviderConfig } from '@backstage/core-components';
import { LoginSurface, customizeAuthProviderConfig } from './LoginSurface';
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
        config: () => 'guest',
        enabled: () => true,
        authProviderKey: 'guest',
      });

      expect(loginSurface.hasProviders()).toEqual(true);
    });
  });

  describe('enabledProviders', () => {
    it('returns the provider configs for enabled providers', () => {
      const loginSurface = new LoginSurface();
      loginSurface.add({
        config: () => 'guest',
        enabled: () => true,
        authProviderKey: 'guest',
      });
      const mockConfig = new MockConfigApi({
        app: { baseUrl: 'https://example.com' },
      });

      expect(loginSurface.enabledProviders(mockConfig)).toEqual(['guest']);
    });

    it('does not return provider configs for providers that are not enabled', () => {
      const loginSurface = new LoginSurface();
      loginSurface.add({
        config: () => 'guest',
        enabled: () => false,
        authProviderKey: 'guest',
      });
      const mockConfig = new MockConfigApi({
        app: { baseUrl: 'https://example.com' },
      });

      expect(loginSurface.enabledProviders(mockConfig)).toEqual([]);
    });
  });
});

describe('customizeAuthProviderConfig', () => {
  let mockDefaultConfig: SignInProviderConfig;

  beforeAll(() => {
    mockDefaultConfig = {
      id: 'test-mock-auth-provider',
      title: 'original title',
      message: 'original message',
      apiRef: createApiRef({
        id: 'esback.auth.mock',
      }),
    };
  });

  it('returns the default values when there are no customized values provided in app config', () => {
    const expectedConfig = {
      id: 'test-mock-auth-provider',
      title: 'original title',
      message: 'original message',
    };

    const mockAppConfig = new MockConfigApi({
      app: { baseUrl: 'https://example.com' },
      auth: {
        loginPage: {},
      },
    });

    expect(
      customizeAuthProviderConfig(mockAppConfig, mockDefaultConfig, 'mock'),
    ).toEqual(expectedConfig);
  });

  it('returns customized values when they are provided in app config', () => {
    const expectedConfig = {
      id: 'modified-mock-auth-provider',
      title: 'custom title',
      message: 'custom message',
    };

    const mockAppConfig = new MockConfigApi({
      app: { baseUrl: 'https://example.com' },
      auth: {
        loginPage: {
          mock: {
            ...expectedConfig,
          },
        },
      },
    });

    expect(
      customizeAuthProviderConfig(mockAppConfig, mockDefaultConfig, 'mock'),
    ).toEqual(expectedConfig);
  });
});
