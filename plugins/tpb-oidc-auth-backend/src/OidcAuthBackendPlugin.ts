import { BackendPluginInterface } from '@tpb/core';
import { providers } from '@backstage/plugin-auth-backend';
import {
  SignInProviderSurface,
  SignInResolverSurface,
} from '@tpb/plugin-auth-backend';
import { oidcAuthProviderKey } from '@tpb/plugin-oidc-auth';

export const OidcAuthBackendPlugin: BackendPluginInterface = () => store => {
  store.applyWithDependency(
    SignInProviderSurface,
    SignInResolverSurface,
    (providerSurface, resolverSurface) => {
      providerSurface.add({
        oidc: providers.oidc.create({
          signIn: {
            resolver: resolverSurface.getResolver(oidcAuthProviderKey),
          },
        }),
      });
    },
  );
};
