import { BackendPluginInterface } from '@tpb/core';
import { providers } from '@backstage/plugin-auth-backend';
import { SignInProviderResolverSurface } from '@tpb/plugin-auth-backend';

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
