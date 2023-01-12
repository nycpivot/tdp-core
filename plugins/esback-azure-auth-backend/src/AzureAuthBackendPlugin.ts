import { BackendPluginInterface } from '@esback/core';
import { providers } from '@backstage/plugin-auth-backend';
import { SignInProviderResolverSurface } from '@esback/plugin-auth-backend';

export const AzureAuthBackendPlugin: BackendPluginInterface =
  () => surfaceStore => {
    surfaceStore.applyTo(
      SignInProviderResolverSurface,
      signInProviderResolverSurface => {
        signInProviderResolverSurface.add({
          microsoft: providers.microsoft.create({
            signIn: {
              resolver: signInProviderResolverSurface.signInAsGuestResolver(),
            },
          }),
        });
      },
    );
  };
