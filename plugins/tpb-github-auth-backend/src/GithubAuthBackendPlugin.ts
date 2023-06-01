import { BackendPluginInterface } from '@tpb/core-backend';
import { providers } from '@backstage/plugin-auth-backend';
import { SignInProviderSurface } from '@tpb/plugin-auth-backend';
import { SignInResolverSurface } from '@tpb/plugin-auth-backend';

export const GithubAuthBackendPlugin: BackendPluginInterface =
  () => surfaceStore => {
    surfaceStore.applyWithDependency(
      SignInProviderSurface,
      SignInResolverSurface,
      (providerSurface, resolverSurface) => {
        providerSurface.add({
          github: providers.github.create({
            signIn: {
              resolver: resolverSurface.getResolver('github'),
            },
          }),
        });
      },
    );
  };
