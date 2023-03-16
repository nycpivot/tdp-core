import { BackendPluginInterface } from '@tpb/core';
import { providers } from '@backstage/plugin-auth-backend';
import { SignInProviderResolverSurface } from '@tpb/plugin-auth-backend';

export const OktaAuthBackendPlugin: BackendPluginInterface = () => store => {
  store.applyTo(SignInProviderResolverSurface, surface => {
    surface.add({
      okta: providers.okta.create({
        signIn: {
          resolver: surface.signInAsGuestResolver(),
        },
      }),
    });
  });
};
