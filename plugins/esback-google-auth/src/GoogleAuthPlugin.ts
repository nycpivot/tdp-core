import { BackendPluginInterface } from '@esback/core';
import { ConfigApi, googleAuthApiRef } from '@backstage/core-plugin-api';
import { LoginSurface } from '@esback/plugin-login';

export const GoogleAuthPlugin: BackendPluginInterface = () => surfaces => {
  surfaces.applyTo(LoginSurface, surface => {
    surface.add({
      config: {
        id: 'google-auth-provider',
        title: 'Google',
        message: 'Sign in with Google OAuth',
        apiRef: googleAuthApiRef,
      },
      enabled: (configApi: ConfigApi) => configApi.has('auth.providers.google'),
      authProviderKey: 'google'
    });
  });
};
