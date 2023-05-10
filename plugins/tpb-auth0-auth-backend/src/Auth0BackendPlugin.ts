import { BackendPluginInterface } from '@tpb/core';
import { providers } from '@backstage/plugin-auth-backend';
import {
  SignInProviderSurface,
  SignInResolverSurface,
} from '@tpb/plugin-auth-backend';
import { auth0AuthProviderKey } from '@tpb/plugin-auth0-auth';

export const Auth0BackendPlugin: BackendPluginInterface =
  () => surfaceStore => {
    surfaceStore.applyWithDependency(
      SignInProviderSurface,
      SignInResolverSurface,
      (providerSurface, resolverSurface) => {
        providerSurface.add({
          auth0: providers.auth0.create({
            signIn: {
              resolver: resolverSurface.getResolver(auth0AuthProviderKey),
            },
          }),
        });
      },
    );
  };
