import { BackendPluginInterface } from '@esback/core';
import { LoginSurface } from '../../esback-login/src/LoginSurface';
import { microsoftAuthApiRef } from '@backstage/core-plugin-api';

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
