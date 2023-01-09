import { BackendPluginInterface } from '@esback/core';
import { LoginSurface } from '@esback/plugin-login';
import { ConfigApi } from '@backstage/core-plugin-api';

export const GuestAuthPlugin: BackendPluginInterface = () => surfaces => {
  surfaces.applyTo(LoginSurface, surface => {
    surface.add({
      config: 'guest',
      enabled: (configApi: ConfigApi) => {
        const optionalAllowGuestAccess = configApi.getOptionalBoolean(
          'auth.allowGuestAccess',
        );
        return optionalAllowGuestAccess === undefined
          ? false
          : optionalAllowGuestAccess.valueOf();
      },
    });
  });
};
