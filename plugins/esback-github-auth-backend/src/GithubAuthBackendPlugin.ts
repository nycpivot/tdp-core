import { BackendPluginInterface } from '@esback/core';
import { providers } from '@backstage/plugin-auth-backend';
import { SignInProviderResolverSurface } from '@esback/plugin-auth-backend';

export const GithubAuthBackendPlugin: BackendPluginInterface =
  () => surfaceStore => {
    surfaceStore.applyTo(
      SignInProviderResolverSurface,
      signInProviderResolverSurface => {
        signInProviderResolverSurface.add({
          github: providers.github.create({
            signIn: {
              resolver: signInProviderResolverSurface.signInAsGuestResolver(),
            },
          }),
        });
      },
    );
  };
