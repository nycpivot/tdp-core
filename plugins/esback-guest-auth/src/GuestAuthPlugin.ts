import { BackendPluginInterface } from '@esback/core';
import { LoginSurface } from '../../esback-login/src/LoginSurface';

export const GuestAuthPlugin: BackendPluginInterface = () => surfaces => {
  surfaces.applyTo(LoginSurface, surface => {
    surface.add('guest');
  });
};
