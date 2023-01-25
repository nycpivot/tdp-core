import { BackendPluginInterface } from '@esback/core';
import { providers } from '@backstage/plugin-auth-backend';
import { SignInProviderResolverSurface } from '@esback/plugin-auth-backend';

export const OneLoginAuthBackendPlugin: BackendPluginInterface =
  () => store => {
    store.applyTo(SignInProviderResolverSurface, surface => {
      surface.add({
        onelogin: providers.onelogin.create({
          signIn: {
            resolver: surface.signInAsGuestResolver(),
          },
        }),
      });
    });
  };
