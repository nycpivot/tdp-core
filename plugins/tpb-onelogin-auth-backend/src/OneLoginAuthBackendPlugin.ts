import { BackendPluginInterface } from '@tpb/core';
import { providers } from '@backstage/plugin-auth-backend';
import { SignInProviderResolverSurface } from '@tpb/plugin-auth-backend';

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
