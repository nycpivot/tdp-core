import { BackendPluginInterface } from '@tpb/core';
import { providers } from '@backstage/plugin-auth-backend';
import { SignInProviderResolverSurface } from '@tpb/plugin-auth-backend';

export const GoogleAuthBackendPlugin: BackendPluginInterface =
  () => surfaceStore => {
    surfaceStore.applyTo(
      SignInProviderResolverSurface,
      signInProviderResolverSurface => {
        signInProviderResolverSurface.add({
          google: providers.google.create({
            signIn: {
              resolver: signInProviderResolverSurface.signInAsGuestResolver(),
            },
          }),
        });
      },
    );
  };
