import { BackendPluginInterface } from '@esback/core';
import { providers } from '@backstage/plugin-auth-backend';
import { SignInProviderResolverSurface } from '@esback/plugin-auth-backend';

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
