import { BackendPluginInterface } from '@esback/core';
import { ConfigApi, oktaAuthApiRef } from '@backstage/core-plugin-api';
import { LoginSurface } from '@esback/plugin-login';

export const OktaAuthPlugin: BackendPluginInterface = () => surfaces => {
  surfaces.applyTo(LoginSurface, surface => {
    surface.add({
      config: {
        id: 'okta-auth-provider',
        title: 'Okta',
        message: 'Sign in with Okta OAuth',
        apiRef: oktaAuthApiRef,
      },
      enabled: (configApi: ConfigApi) => configApi.has('auth.providers.okta'),
    });
  });
};
