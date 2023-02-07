import { BackendPluginInterface } from '@esback/core';
import { ConfigApi, oneloginAuthApiRef } from '@backstage/core-plugin-api';
import { LoginSurface } from '@esback/plugin-login';

export const OneLoginAuthPlugin: BackendPluginInterface = () => surfaces => {
  surfaces.applyTo(LoginSurface, surface => {
    surface.add({
      config: {
        id: 'onelogin-auth-provider',
        title: 'OneLogin',
        message: 'Sign in with OneLogin',
        apiRef: oneloginAuthApiRef,
      },
      enabled: (configApi: ConfigApi) => configApi.has('auth.providers.onelogin'),
      authProviderKey: 'onelogin'
    });
  });
};
