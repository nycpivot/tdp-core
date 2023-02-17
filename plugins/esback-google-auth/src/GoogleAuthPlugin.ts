import { BackendPluginInterface } from '@esback/core';
import { ConfigApi, googleAuthApiRef } from '@backstage/core-plugin-api';
import {
  customizeAuthProviderConfig,
  LoginSurface,
} from '@esback/plugin-login';

export const GoogleAuthPlugin: BackendPluginInterface = () => surfaces => {
  const defaultConfig = {
    id: 'google-auth-provider',
    title: 'Google',
    message: 'Sign in with Google OAuth',
  };

  surfaces.applyTo(LoginSurface, surface => {
    surface.add({
      config: (configApi: ConfigApi) => ({
        ...customizeAuthProviderConfig(configApi, defaultConfig, 'google'),
        apiRef: googleAuthApiRef,
      }),
      enabled: (configApi: ConfigApi) => configApi.has('auth.providers.google'), // TODO: ESBACK-163 - needs test for case when config does not exist
      authProviderKey: 'google',
    });
  });
};
