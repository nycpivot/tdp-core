import { BackendPluginInterface } from '@tpb/core';
import { ConfigApi, googleAuthApiRef } from '@backstage/core-plugin-api';
import { customizeAuthProviderConfig, LoginSurface } from '@tpb/plugin-login';

export const googleAuthProviderKey = 'google';

export const GoogleAuthPlugin: BackendPluginInterface = () => surfaces => {
  const defaultConfig = {
    id: 'google-auth-provider',
    title: 'Google',
    message: 'Sign in with Google OAuth',
  };

  surfaces.applyTo(LoginSurface, surface => {
    surface.add({
      config: (configApi: ConfigApi) => ({
        ...customizeAuthProviderConfig(
          configApi,
          defaultConfig,
          googleAuthProviderKey,
        ),
        apiRef: googleAuthApiRef,
      }),
      enabled: (configApi: ConfigApi) =>
        configApi.has(`auth.providers.${googleAuthProviderKey}`), // TODO: ESBACK-163 - needs test for case when config does not exist
      authProviderKey: googleAuthProviderKey,
    });
  });
};
