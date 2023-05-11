import { BackendPluginInterface } from '@tpb/core';
import { providers } from '@backstage/plugin-auth-backend';
import {
  SignInProviderSurface,
  SignInResolverSurface,
} from '@tpb/plugin-auth-backend';

export const OktaAuthBackendPlugin: BackendPluginInterface = () => store => {
  store.applyWithDependency(
    SignInProviderSurface,
    SignInResolverSurface,
    (providerSurface, resolverSurface) => {
      providerSurface.add({
        okta: providers.okta.create({
          signIn: {
            resolver: resolverSurface.getResolver('okta'),
          },
        }),
      });
    },
  );
};
