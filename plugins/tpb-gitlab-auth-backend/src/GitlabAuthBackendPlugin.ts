import { BackendPluginInterface } from '@tpb/core';
import { providers } from '@backstage/plugin-auth-backend';
import { SignInProviderSurface } from '@tpb/plugin-auth-backend';
import { SignInResolverSurface } from '@tpb/plugin-auth-backend';
import { gitlabAuthProviderKey } from '@tpb/plugin-gitlab-auth';

export const GitlabAuthBackendPlugin: BackendPluginInterface =
  () => surfaceStore => {
    surfaceStore.applyWithDependency(
      SignInProviderSurface,
      SignInResolverSurface,
      (providerSurface, resolverSurface) => {
        providerSurface.add({
          gitlab: providers.gitlab.create({
            signIn: {
              resolver: resolverSurface.getResolver(gitlabAuthProviderKey),
            },
          }),
        });
      },
    );
  };
