import { BackendPluginInterface } from '@tpb/core';
import {
  GithubOAuthResult,
  providers,
  SignInResolver,
} from '@backstage/plugin-auth-backend';
import { SignInProviderSurface } from '@tpb/plugin-auth-backend';
import { SignInResolverSurface } from '@tpb/plugin-auth-backend';
import { BackstageSignInResult } from '@backstage/plugin-auth-node';

const githubSignInResolver =
  (
    signInResolverSurface: SignInResolverSurface,
  ): SignInResolver<GithubOAuthResult> =>
  async (info, context): Promise<BackstageSignInResult> => {
    const { fullProfile } = info.result;
    const userId = fullProfile.username;
    if (!userId) {
      throw new Error(
        'Github login failed, user profile does not contain a username',
      );
    }

    return signInResolverSurface.signInWithName(userId, context);
  };

export const GithubAuthBackendPlugin: BackendPluginInterface =
  () => surfaceStore => {
    surfaceStore.applyWithDependency(
      SignInProviderSurface,
      SignInResolverSurface,
      (providerSurface, resolverSurface) => {
        providerSurface.add({
          github: providers.github.create({
            signIn: {
              resolver: githubSignInResolver(resolverSurface),
            },
          }),
        });
      },
    );
  };
