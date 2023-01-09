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
      enabled: (configApi: ConfigApi) => {
        const optionalMicrosoftConfig = configApi.getOptional(
          'auth.providers.microsoft',
        );
        return optionalMicrosoftConfig !== undefined;
      },
    });
  });
};
