import { BackendPluginInterface } from '@esback/core';
import { providers } from '@backstage/plugin-auth-backend';
import { SignInProviderResolverSurface } from '@esback/plugin-auth-backend';
import { stringifyEntityRef } from '@backstage/catalog-model';

export const GoogleAuthBackendPlugin: BackendPluginInterface =
  () => surfaceStore => {
    surfaceStore.applyTo(
      SignInProviderResolverSurface,
      signInProviderResolverSurface => {
        signInProviderResolverSurface.add({
          google: providers.google.create({
            signIn: {
              resolver(info, ctx) {
                const email = info.profile.email;
                if (!email) {
                  throw new Error(
                    'Google login failed, user profile does not contain an email',
                  );
                }

                const userEntityRef = stringifyEntityRef({
                  kind: 'User',
                  name: email,
                });

                return ctx.issueToken({
                  claims: {
                    sub: userEntityRef,
                    ent: [userEntityRef],
                  },
                });
              },
            },
          }),
        });
      },
    );
  };
