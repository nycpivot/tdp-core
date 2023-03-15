import { BackendPluginInterface } from '@tpb/core';
import { providers } from '@backstage/plugin-auth-backend';
import { SignInProviderResolverSurface } from '@tpb/plugin-auth-backend';

export const Auth0BackendPlugin: BackendPluginInterface =
  () => surfaceStore => {
    surfaceStore.applyTo(
      SignInProviderResolverSurface,
      signInProviderResolverSurface => {
        signInProviderResolverSurface.add({
          auth0: providers.auth0.create({
            signIn: {
              resolver: signInProviderResolverSurface.signInAsGuestResolver(),
            },
          }),
        });
      },
    );
  };
