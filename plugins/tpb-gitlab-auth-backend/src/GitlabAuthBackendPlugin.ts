import { BackendPluginInterface } from '@tpb/core-backend';
import { providers } from '@backstage/plugin-auth-backend';
import { SignInProviderSurface } from '@tpb/plugin-auth-backend';
import { SignInResolverSurface } from '@tpb/plugin-auth-backend';

export const GitlabAuthBackendPlugin: BackendPluginInterface =
  () => surfaceStore => {
    surfaceStore.applyWithDependency(
      SignInProviderSurface,
      SignInResolverSurface,
      (providerSurface, resolverSurface) => {
        providerSurface.add({
          gitlab: providers.gitlab.create({
            signIn: {
              resolver: resolverSurface.getResolver('gitlab'),
            },
          }),
        });
      },
    );
  };
