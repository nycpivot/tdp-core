import { BackendPluginInterface } from '@esback/core';
import { microsoftAuthApiRef } from '@backstage/core-plugin-api';
import { LoginSurface } from '@esback/plugin-login';

export const AzureAuthPlugin: BackendPluginInterface = () => surfaces => {
  surfaces.applyTo(LoginSurface, surface => {
    surface.add({
      id: 'azure-auth-provider',
      title: 'Azure',
      message: 'Sign in with Azure OAuth',
      apiRef: microsoftAuthApiRef,
    });
  });
};
