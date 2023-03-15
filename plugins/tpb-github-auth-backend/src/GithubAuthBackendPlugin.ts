import { BackendPluginInterface } from '@tpb/core';
import { providers } from '@backstage/plugin-auth-backend';
import { SignInProviderResolverSurface } from '@tpb/plugin-auth-backend';

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
