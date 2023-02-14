import { BackendPluginInterface } from '@esback/core';
import { ConfigApi, oktaAuthApiRef } from '@backstage/core-plugin-api';
import { LoginSurface } from '@esback/plugin-login';
import { customizeAuthProviderConfig } from '@esback/plugin-login/src/LoginSurface';

export const OktaAuthPlugin: BackendPluginInterface = () => surfaces => {
  const defaultConfig = {
    id: 'okta-auth-provider',
    title: 'Okta',
    message: 'Sign in with Okta OAuth'
  };

  surfaces.applyTo(LoginSurface, surface => {
    surface.add({
      config: (configApi: ConfigApi) => ({
        ...customizeAuthProviderConfig(configApi, defaultConfig, 'okta'),
        apiRef: oktaAuthApiRef,
      }),
      enabled: (configApi: ConfigApi) => configApi.has('auth.providers.okta'), // TODO: ESBACK-163 - needs test for case when config does not exist
      authProviderKey: 'okta'
    });
  });
};
