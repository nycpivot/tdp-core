import { BackendPluginInterface } from '@esback/core';
import { ConfigApi, oneloginAuthApiRef } from '@backstage/core-plugin-api';
import { LoginSurface } from '@esback/plugin-login';
import { customizeAuthProviderConfig } from '@esback/plugin-login/src/LoginSurface';

export const OneLoginAuthPlugin: BackendPluginInterface = () => surfaces => {
  const defaultConfig = {
    id: 'onelogin-auth-provider',
    title: 'OneLogin',
    message: 'Sign in with OneLogin',
  };

  surfaces.applyTo(LoginSurface, surface => {
    surface.add({
      config: (configApi: ConfigApi) => ({
        ...customizeAuthProviderConfig(configApi, defaultConfig, 'onelogin'),
        apiRef: oneloginAuthApiRef,
      }),
      enabled: (configApi: ConfigApi) =>
        configApi.has('auth.providers.onelogin'), // TODO: ESBACK-163 - needs test for case when config does not exist
      authProviderKey: 'onelogin',
    });
  });
};
