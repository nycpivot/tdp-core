import { AppPluginInterface } from '@tpb/core-frontend';
import { ConfigApi, microsoftAuthApiRef } from '@backstage/core-plugin-api';
import { customizeAuthProviderConfig, LoginSurface } from '@tpb/plugin-login';

export const azureAuthProviderKey = 'microsoft';
export const AzureAuthPlugin: AppPluginInterface = () => surfaces => {
  const defaultConfig = {
    id: 'azure-auth-provider',
    title: 'Azure',
    message: 'Sign in with Azure OAuth',
  };

  surfaces.applyTo(LoginSurface, surface => {
    surface.add({
      config: (configApi: ConfigApi) => ({
        ...customizeAuthProviderConfig(
          configApi,
          defaultConfig,
          azureAuthProviderKey,
        ),
        apiRef: microsoftAuthApiRef,
      }),
      enabled: (configApi: ConfigApi) =>
        configApi.has(`auth.providers.${azureAuthProviderKey}`), // TODO: ESBACK-163 - needs test for case when config does not exist
      authProviderKey: azureAuthProviderKey,
    });
  });
};
