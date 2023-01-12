import { BackendPluginInterface } from '@esback/core';
import { providers } from '@backstage/plugin-auth-backend';
import { SignInProviderResolverSurface } from '@esback/plugin-auth-backend';

export const GoogleAuthBackendPlugin: BackendPluginInterface =
  () => surfaceStore => {
    surfaceStore.applyTo(
      SignInProviderResolverSurface,
      signInProviderResolverSurface => {
        signInProviderResolverSurface.add({
          google: providers.google.create({
            signIn: {
              resolver(_, ctx) {
                const userRef = 'user:default/guest';
                return ctx.issueToken({
                  claims: {
                    sub: userRef,
                    ent: [userRef],
                  },
                });
              },
            },
          }),
        });
      },
    );
  };
