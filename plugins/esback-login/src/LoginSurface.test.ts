import { LoginSurface } from './LoginSurface';
import { MockConfigApi } from '@backstage/test-utils';

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
      });

      expect(loginSurface.hasProviders()).toEqual(true);
    });
  });

  describe('enabledProviders', () => {
    it('returns the provider configs for enabled providers', () => {
      const loginSurface = new LoginSurface();
      loginSurface.add({
        config: 'guest',
        enabled: () => true,
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
      });
      const mockConfig = new MockConfigApi({
        app: { baseUrl: 'https://example.com' },
      });

      expect(loginSurface.enabledProviders(mockConfig)).toEqual([]);
    });
  });
});
