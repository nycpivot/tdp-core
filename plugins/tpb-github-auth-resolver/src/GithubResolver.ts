import { BackendPluginInterface } from '@tpb/core-backend';
import { SignInResolverSurface } from '@tpb/plugin-auth-backend';
import {
  GithubOAuthResult,
  SignInResolver,
} from '@backstage/plugin-auth-backend';
import { BackstageSignInResult } from '@backstage/plugin-auth-node';

export const GithubResolverPlugin: BackendPluginInterface = () => surfaces => {
  const GithubSignInResolver =
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

  surfaces.applyTo(SignInResolverSurface, surface => {
    surface.add('github', GithubSignInResolver(surface));
  });
};
