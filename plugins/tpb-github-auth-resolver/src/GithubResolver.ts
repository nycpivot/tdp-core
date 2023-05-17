import { stringifyEntityRef } from '@backstage/catalog-model';
import { NotFoundError } from '@backstage/errors';
import { BackendPluginInterface } from '@tpb/core';
import { SignInResolverSurface } from '@tpb/plugin-auth-backend';
import { AuthResolverContext, GithubOAuthResult, SignInResolver } from '@backstage/plugin-auth-backend';
import { BackstageSignInResult } from '@backstage/plugin-auth-node';

export const GithubResolverPlugin: BackendPluginInterface = () => surfaces => {
  const GithubSignInResolver: SignInResolver<GithubOAuthResult> =
  async (info, context): Promise<BackstageSignInResult> => {
    const { fullProfile } = info.result;
    const userId = fullProfile.username;
    if (!userId) {
      throw new Error('Github login failed, user profile does not contain a username');
    }

    return signInWithName(userId, context);
  };

  /**
   * Attempt to match the name with a catalog user for sign in.
   * If that fails, sign in the user with that name without associating with a catalog user.
   */
async function signInWithName(name: string, context: AuthResolverContext): Promise<BackstageSignInResult> {
  const userEntityRef = stringifyEntityRef({
    kind: 'User',
    name: name,
  });

  try {
    // we await here so that signInWithName throws in the current `try`
    return await context.signInWithCatalogUser({
      entityRef: userEntityRef,
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
    surface.add('github', GithubSignInResolver);
  });
};
