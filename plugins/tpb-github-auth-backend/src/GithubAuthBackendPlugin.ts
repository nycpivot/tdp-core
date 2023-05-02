import { BackendPluginInterface } from '@tpb/core';
import {
  GithubOAuthResult,
  providers,
  SignInResolver,
} from '@backstage/plugin-auth-backend';
import { BackstageSignInResult } from '@backstage/plugin-auth-node';
import { SignInProviderResolverSurface } from '@tpb/plugin-auth-backend';

const githubSignInResolver =
  (
    signInProviderResolverSurface: SignInProviderResolverSurface,
  ): SignInResolver<GithubOAuthResult> =>
  async (info, context): Promise<BackstageSignInResult> => {
    const { fullProfile } = info.result;
    const userId = fullProfile.username;
    if (!userId) {
      throw new Error(
        'Github login failed, user profile does not contain a username',
      );
    }

    return signInProviderResolverSurface.signInWithName(userId, context);
  };

export const GithubAuthBackendPlugin: BackendPluginInterface =
  () => surfaceStore => {
    surfaceStore.applyTo(
      SignInProviderResolverSurface,
      signInProviderResolverSurface => {
        signInProviderResolverSurface.add({
          github: providers.github.create({
            signIn: {
              resolver: githubSignInResolver(signInProviderResolverSurface),
            },
          }),
        });
      },
    );
  };
