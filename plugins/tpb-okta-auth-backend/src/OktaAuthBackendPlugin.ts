import { BackendPluginInterface } from '@tpb/core';
import { providers } from '@backstage/plugin-auth-backend';
import {
  SignInProviderSurface,
  SignInResolverSurface,
} from '@tpb/plugin-auth-backend';
import { oktaAuthProviderKey } from '@tpb/plugin-okta-auth';

export const OktaAuthBackendPlugin: BackendPluginInterface = () => store => {
  store.applyWithDependency(
    SignInProviderSurface,
    SignInResolverSurface,
    (providerSurface, resolverSurface) => {
      providerSurface.add({
        okta: providers.okta.create({
          signIn: {
            resolver: resolverSurface.getResolver(oktaAuthProviderKey),
          },
        }),
      });
    },
  );
};
