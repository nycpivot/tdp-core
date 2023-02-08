import { BackendPluginInterface } from '@esback/core';
import { ConfigApi, microsoftAuthApiRef } from '@backstage/core-plugin-api';
import { LoginSurface } from '@esback/plugin-login';

export const AzureAuthPlugin: BackendPluginInterface = () => surfaces => {
  surfaces.applyTo(LoginSurface, surface => {
    surface.add({
      config: {
        id: 'azure-auth-provider',
        title: 'Azure',
        message: 'Sign in with Azure OAuth',
        apiRef: microsoftAuthApiRef,
      },
      enabled: (configApi: ConfigApi) => configApi.has('auth.providers.microsoft'), // TODO: ESBACK-163 - needs test for case when config does not exist
      authProviderKey: 'microsoft'
    });
  });
};
