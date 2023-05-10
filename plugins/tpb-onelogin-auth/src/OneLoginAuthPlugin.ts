import { BackendPluginInterface } from '@tpb/core';
import { ConfigApi, oneloginAuthApiRef } from '@backstage/core-plugin-api';
import { customizeAuthProviderConfig, LoginSurface } from '@tpb/plugin-login';

export const oneLoginAuthProviderKey = 'onelogin';

export const OneLoginAuthPlugin: BackendPluginInterface = () => surfaces => {
  const defaultConfig = {
    id: 'onelogin-auth-provider',
    title: 'OneLogin',
    message: 'Sign in with OneLogin',
  };

  surfaces.applyTo(LoginSurface, surface => {
    surface.add({
      config: (configApi: ConfigApi) => ({
        ...customizeAuthProviderConfig(
          configApi,
          defaultConfig,
          oneLoginAuthProviderKey,
        ),
        apiRef: oneloginAuthApiRef,
      }),
      enabled: (configApi: ConfigApi) =>
        configApi.has(`auth.providers.${oneLoginAuthProviderKey}`), // TODO: ESBACK-163 - needs test for case when config does not exist
      authProviderKey: oneLoginAuthProviderKey,
    });
  });
};
