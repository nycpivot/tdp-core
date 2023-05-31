import { BackendPluginInterface } from '@tpb/core-backend';
import { SignInResolverSurface } from '@tpb/plugin-auth-backend';
import { OAuthResult, SignInResolver } from '@backstage/plugin-auth-backend';
import { BackstageSignInResult } from '@backstage/plugin-auth-node';

export const GoogleResolverPlugin: BackendPluginInterface = () => surfaces => {
  const GoogleSignInResolver =
    (
      signInResolverSurface: SignInResolverSurface,
    ): SignInResolver<OAuthResult> =>
    async (info, context): Promise<BackstageSignInResult> => {
      const email = info.profile.email;
      if (!email) {
        throw new Error(
          'Google login failed, user profile does not contain an email',
        );
      }
      return signInResolverSurface.signInWithEmail(email, context);
    };

  surfaces.applyTo(SignInResolverSurface, surface => {
    surface.add('google', GoogleSignInResolver(surface));
  });
};
