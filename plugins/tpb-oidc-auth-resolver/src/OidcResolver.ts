import { BackendPluginInterface } from '@tpb/core-backend';
import { SignInResolverSurface } from '@tpb/plugin-auth-backend';
import { OidcAuthResult, SignInResolver } from '@backstage/plugin-auth-backend';
import { BackstageSignInResult } from '@backstage/plugin-auth-node';

export const OidcResolverPlugin: BackendPluginInterface = () => surfaces => {
  const OidcSignInResolver =
    (
      signInResolverSurface: SignInResolverSurface,
    ): SignInResolver<OidcAuthResult> =>
    async (info, context): Promise<BackstageSignInResult> => {
      const email = info.profile.email;
      if (!email) {
        throw new Error(
          'OIDC login failed, user profile does not contain an email',
        );
      }
      return signInResolverSurface.signInWithEmail(email, context);
    };

  surfaces.applyTo(SignInResolverSurface, surface => {
    surface.add('oidc', OidcSignInResolver(surface));
  });
};
