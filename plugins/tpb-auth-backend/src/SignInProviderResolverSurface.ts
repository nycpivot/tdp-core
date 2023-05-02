import {
  AuthResolverContext,
  SignInInfo,
  SignInResolver,
} from '@backstage/plugin-auth-backend';
import { BackstageSignInResult } from '@backstage/plugin-auth-node';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { NotFoundError } from '@backstage/errors';

export type SignInProvider = {};

export class SignInProviderResolverSurface {
  private _signInProvidersResolvers = {};

  public add(signInProvider: SignInProvider) {
    this._signInProvidersResolvers = {
      ...signInProvider,
      ...this._signInProvidersResolvers,
    };
  }

  public allSignInProviders() {
    return this._signInProvidersResolvers;
  }

  public signInAsGuestResolver<TAuthResult>(): SignInResolver<TAuthResult> {
    return (_: SignInInfo<TAuthResult>, ctx: AuthResolverContext) => {
      const userRef = 'user:default/guest'; // Must be a full entity reference
      return ctx.issueToken({
        claims: {
          sub: userRef, // The user's own identity
          ent: [userRef], // A list of identities that the user claims ownership through
        },
      });
    };
  }

  /**
   * Attempt to match the name with a catalog user for sign in.
   * If that fails, sign in the user with that name without associating with a catalog user.
   */
  public async signInWithName(
    name: string,
    context: AuthResolverContext,
  ): Promise<BackstageSignInResult> {
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
}
