import { BackendPluginInterface } from '@tpb/core';
import { providers } from '@backstage/plugin-auth-backend';
import {
  SignInProviderSurface,
  SignInResolverSurface,
} from '@tpb/plugin-auth-backend';

export const OneLoginAuthBackendPlugin: BackendPluginInterface =
  () => store => {
    store.applyWithDependency(
      SignInProviderSurface,
      SignInResolverSurface,
      (providerSurface, resolverSurface) => {
        providerSurface.add({
          onelogin: providers.onelogin.create({
            signIn: {
              resolver: resolverSurface.getResolver('onelogin'),
            },
          }),
        });
      },
    );
  };
