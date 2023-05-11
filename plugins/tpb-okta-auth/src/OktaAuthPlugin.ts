import { BackendPluginInterface } from '@tpb/core';
import { ConfigApi, oktaAuthApiRef } from '@backstage/core-plugin-api';
import { customizeAuthProviderConfig, LoginSurface } from '@tpb/plugin-login';

export const oktaAuthProviderKey = 'okta';

export const OktaAuthPlugin: BackendPluginInterface = () => surfaces => {
  const defaultConfig = {
    id: 'okta-auth-provider',
    title: 'Okta',
    message: 'Sign in with Okta OAuth',
  };

  surfaces.applyTo(LoginSurface, surface => {
    surface.add({
      config: (configApi: ConfigApi) => ({
        ...customizeAuthProviderConfig(
          configApi,
          defaultConfig,
          oktaAuthProviderKey,
        ),
        apiRef: oktaAuthApiRef,
      }),
      enabled: (configApi: ConfigApi) =>
        configApi.has(`auth.providers.${oktaAuthProviderKey}`), // TODO: ESBACK-163 - needs test for case when config does not exist
      authProviderKey: oktaAuthProviderKey,
    });
  });
};
