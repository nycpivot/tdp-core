import { BackendPluginInterface } from '@tpb/core';
import { SignInResolverSurface } from '@tpb/plugin-auth-backend';
import { OAuthResult, SignInResolver } from '@backstage/plugin-auth-backend';
import { BackstageSignInResult } from '@backstage/plugin-auth-node';

export const Auth0ResolverPlugin: BackendPluginInterface = () => surfaces => {
  const Auth0SignInResolver =
    (
      signInResolverSurface: SignInResolverSurface,
    ): SignInResolver<OAuthResult> =>
    async (info, context): Promise<BackstageSignInResult> => {
      const email = info.profile.email;
      if (!email) {
        throw new Error(
          'Auth0 login failed, user profile does not contain an email',
        );
      }
      return signInResolverSurface.signInWithEmail(email, context);
    };

  surfaces.applyTo(SignInResolverSurface, surface => {
    surface.add('auth0', Auth0SignInResolver(surface));
  });
};
