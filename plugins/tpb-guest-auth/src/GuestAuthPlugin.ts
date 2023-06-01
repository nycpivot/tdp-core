import { AppPluginInterface } from '@tpb/core-frontend';
import { LoginSurface } from '@tpb/plugin-login';
import { ConfigApi } from '@backstage/core-plugin-api';

export const guestAuthProviderKey = 'guest';

export const GuestAuthPlugin: AppPluginInterface = () => surfaces => {
  surfaces.applyTo(LoginSurface, surface => {
    surface.add({
      config: _ => 'guest',
      enabled: (configApi: ConfigApi) => {
        const optionalAllowGuestAccess = configApi.getOptionalBoolean(
          'auth.allowGuestAccess',
        );
        return optionalAllowGuestAccess === undefined
          ? false
          : optionalAllowGuestAccess.valueOf();
      },
      authProviderKey: guestAuthProviderKey,
    });
  });
};
