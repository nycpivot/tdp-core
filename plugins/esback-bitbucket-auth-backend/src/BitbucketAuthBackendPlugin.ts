import { BackendPluginInterface } from '@esback/core';
import { providers } from '@backstage/plugin-auth-backend';
import { SignInProviderResolverSurface } from '@esback/plugin-auth-backend';

export const BitbucketAuthBackendPlugin: BackendPluginInterface =
  () => store => {
    store.applyTo(SignInProviderResolverSurface, surface => {
      surface.add({
        bitbucket: providers.bitbucket.create({
          signIn: {
            resolver: surface.signInAsGuestResolver(),
          },
        }),
      });
    });
  };
