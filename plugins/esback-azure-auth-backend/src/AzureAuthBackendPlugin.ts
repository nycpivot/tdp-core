import { BackendPluginInterface } from '@esback/core';
import { providers } from '@backstage/plugin-auth-backend';
import { SignInProviderResolverSurface } from '@esback/plugin-auth-backend';

export const AzureAuthBackendPlugin: BackendPluginInterface =
  () => surfaceStore => {
    surfaceStore.applyTo(
      SignInProviderResolverSurface,
      signInProviderResolverSurface => {
        signInProviderResolverSurface.add({
          microsoft: providers.microsoft.create({
            signIn: {
              resolver(_, ctx) {
                const userRef = 'user:default/guest'; // Must be a full entity reference
                return ctx.issueToken({
                  claims: {
                    sub: userRef, // The user's own identity
                    ent: [userRef], // A list of identities that the user claims ownership through
                  },
                });
              },
            },
          }),
        });
      },
    );
  };
