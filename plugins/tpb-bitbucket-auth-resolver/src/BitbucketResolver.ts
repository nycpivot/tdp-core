import { BackendPluginInterface } from '@tpb/core-backend';
import { SignInResolverSurface } from '@tpb/plugin-auth-backend';
import { OAuthResult, SignInResolver } from '@backstage/plugin-auth-backend';
import { BackstageSignInResult } from '@backstage/plugin-auth-node';

export const BitbucketResolverPlugin: BackendPluginInterface =
  () => surfaces => {
    const BitbucketSignInResolver =
      (
        signInResolverSurface: SignInResolverSurface,
      ): SignInResolver<OAuthResult> =>
      async (info, context): Promise<BackstageSignInResult> => {
        const { fullProfile } = info.result;
        const userId = fullProfile.username;
        if (!userId) {
          throw new Error(
            'Bitbucket login failed, user profile does not contain a username',
          );
        }
        return signInResolverSurface.signInWithName(userId, context);
      };

    surfaces.applyTo(SignInResolverSurface, surface => {
      surface.add('bitbucket', BitbucketSignInResolver(surface));
    });
  };
