import { BackendPluginInterface } from '@tpb/core-backend';
import { providers } from '@backstage/plugin-auth-backend';
import {
  SignInProviderSurface,
  SignInResolverSurface,
} from '@tpb/plugin-auth-backend';

export const BitbucketAuthBackendPlugin: BackendPluginInterface =
  () => store => {
    store.applyWithDependency(
      SignInProviderSurface,
      SignInResolverSurface,
      (providerSurface, resolverSurface) => {
        providerSurface.add({
          bitbucket: providers.bitbucket.create({
            signIn: {
              resolver: resolverSurface.getResolver('bitbucket'),
            },
          }),
        });
      },
    );
  };
