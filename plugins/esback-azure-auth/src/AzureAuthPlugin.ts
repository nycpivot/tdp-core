import { BackendPluginInterface } from '@esback/core';
import { ConfigApi, microsoftAuthApiRef } from '@backstage/core-plugin-api';
import { LoginSurface } from '@esback/plugin-login';
import { customizeAuthProviderConfig } from '@esback/plugin-login/src/LoginSurface';

export const AzureAuthPlugin: BackendPluginInterface = () => surfaces => {
  const defaultConfig = {
    id: 'azure-auth-provider',
    title: 'Azure',
    message: 'Sign in with Azure OAuth',
  };

  surfaces.applyTo(LoginSurface, surface => {
    surface.add({
      config: (configApi: ConfigApi) => ({
        ...customizeAuthProviderConfig(configApi, defaultConfig, 'microsoft'),
        apiRef: microsoftAuthApiRef,
      }),
      enabled: (configApi: ConfigApi) => configApi.has('auth.providers.microsoft'), // TODO: ESBACK-163 - needs test for case when config does not exist
      authProviderKey: 'microsoft'
    });
  });
};
