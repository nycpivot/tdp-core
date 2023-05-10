import { BackendPluginInterface } from '@tpb/core';
import { providers } from '@backstage/plugin-auth-backend';
import {
  SignInProviderSurface,
  SignInResolverSurface,
} from '@tpb/plugin-auth-backend';
import { azureAuthProviderKey } from '@tpb/plugin-azure-auth';

export const AzureAuthBackendPlugin: BackendPluginInterface =
  () => surfaceStore => {
    surfaceStore.applyWithDependency(
      SignInProviderSurface,
      SignInResolverSurface,
      (providerSurface, resolverSurface) => {
        providerSurface.add({
          microsoft: providers.microsoft.create({
            signIn: {
              resolver: resolverSurface.getResolver(azureAuthProviderKey),
            },
          }),
        });
      },
    );
  };
