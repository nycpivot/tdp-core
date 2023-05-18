import { stringifyEntityRef } from '@backstage/catalog-model';
import { NotFoundError } from '@backstage/errors';
import { BackendPluginInterface } from '@tpb/core';
import { SignInResolverSurface } from '@tpb/plugin-auth-backend';
import { AuthResolverContext, OAuthResult, SignInResolver } from '@backstage/plugin-auth-backend';
import { BackstageSignInResult } from '@backstage/plugin-auth-node';

export const OktaResolverPlugin: BackendPluginInterface = () => surfaces => {
  const OktaSignInResolver: SignInResolver<OAuthResult> =
  async (info, context): Promise<BackstageSignInResult> => {
    const email = info.profile.email;
    if (!email) {
      throw new Error('Okta login failed, user profile does not contain an email');
    }
    return signInWithEmail(email, context);
  };

/**
 * Attempt to match given email with a catalog user's email for sign in.
 * If that fails, sign in the user without associating with a catalog user.
 */
async function signInWithEmail(email: string, context: AuthResolverContext): Promise<BackstageSignInResult> {
  const userEntityRef = stringifyEntityRef({
    kind: 'User',
    name: email
  });

  try {
    // we await here so that signInWithCatalogUser throws in the current `try`
    return await context.signInWithCatalogUser({
      filter: {
        'spec.profile.email': email,
      },
    });
  } catch (e) {
    if (!(e instanceof NotFoundError)) {
      throw e;
    }
    return context.issueToken({
      claims: {
        sub: userEntityRef,
        ent: [userEntityRef],
      },
    });
  }
}

  surfaces.applyTo(SignInResolverSurface, surface => {
    surface.add('okta', OktaSignInResolver);
  });
};
