import { BackendPluginInterface } from '@tpb/core';
import { SignInResolverSurface } from '@tpb/plugin-auth-backend';
import { OAuthResult, SignInResolver } from '@backstage/plugin-auth-backend';
import { BackstageSignInResult } from '@backstage/plugin-auth-node';

export const AzureResolverPlugin: BackendPluginInterface = () => surfaces => {
  const AzureSignInResolver =
    (
      signInResolverSurface: SignInResolverSurface,
    ): SignInResolver<OAuthResult> =>
    async (info, context): Promise<BackstageSignInResult> => {
      const email = info.profile.email;
      if (!email) {
        throw new Error(
          'Azure login failed, user profile does not contain an email',
        );
      }
      return signInResolverSurface.signInWithName(email, context);
    };

  surfaces.applyTo(SignInResolverSurface, surface => {
    surface.add('azure', AzureSignInResolver(surface));
  });
};
