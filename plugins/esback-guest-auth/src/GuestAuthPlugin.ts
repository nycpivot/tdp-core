import { BackendPluginInterface } from '@esback/core';
import { LoginSurface } from '@esback/plugin-login';

export const GuestAuthPlugin: BackendPluginInterface = () => surfaces => {
  surfaces.applyTo(LoginSurface, surface => {
    surface.add('guest');
  });
};
