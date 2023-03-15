import { BackendPluginInterface } from '@tpb/core';
import { providers } from '@backstage/plugin-auth-backend';
import { SignInProviderResolverSurface } from '@tpb/plugin-auth-backend';

export const OidcAuthBackendPlugin: BackendPluginInterface = () => store => {
  store.applyTo(SignInProviderResolverSurface, surface => {
    surface.add({
      oidc: providers.oidc.create({
        signIn: {
          resolver: surface.signInAsGuestResolver(),
        },
      }),
    });
  });
};
