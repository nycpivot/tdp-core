import { BackendPluginInterface } from '@tpb/core';
import { providers } from '@backstage/plugin-auth-backend';
import {
  SignInProviderSurface,
  SignInResolverSurface,
} from '@tpb/plugin-auth-backend';
import { googleAuthProviderKey } from '@tpb/plugin-google-auth';

export const GoogleAuthBackendPlugin: BackendPluginInterface =
  () => surfaceStore => {
    surfaceStore.applyWithDependency(
      SignInProviderSurface,
      SignInResolverSurface,
      (providerSurface, resolverSurface) => {
        providerSurface.add({
          google: providers.google.create({
            signIn: {
              resolver: resolverSurface.getResolver(googleAuthProviderKey),
            },
          }),
        });
      },
    );
  };
