import {
  AuthResolverContext,
  SignInInfo,
  SignInResolver,
} from '@backstage/plugin-auth-backend';
import { BackstageSignInResult } from '@backstage/plugin-auth-node';
import { NotFoundError } from '@backstage/errors';
import { stringifyEntityRef } from '@backstage/catalog-model';

class ResolverEntry {
  authProviderKey: string;
  readonly resolver: SignInResolver<any>;

  constructor(authProviderKey: string, signInResolver: SignInResolver<any>) {
    this.authProviderKey = authProviderKey;
    this.resolver = signInResolver;
  }
}

export class SignInResolverSurface {
  public static readonly id = 'SignInResolverSurface';
  private _resolvers: ResolverEntry[] = [];

  public add(authProviderKey: string, resolver: SignInResolver<any>) {
    if (
      this._resolvers.some(entry => entry.authProviderKey === authProviderKey)
    ) {
      console.warn(
        `Multiple SignInResolvers are set for ${authProviderKey}, this can cause unexpected behavior.`,
      );
    }
    this._resolvers.push(new ResolverEntry(authProviderKey, resolver));
  }

  public getResolver<TAuthResult>(
    authProviderKey: string,
  ): SignInResolver<TAuthResult> {
    const resolverEntry = this._resolvers.find(
      r => r.authProviderKey === authProviderKey,
    );

    if (resolverEntry) {
      return resolverEntry.resolver;
    }

    return this.signInAsGuestResolver();
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

  /**
   * Attempt to match given email with a catalog user's email for sign in.
   * If that fails, sign in the user without associating with a catalog user.
   */
  public async signInWithEmail(
    email: string,
    context: AuthResolverContext,
  ): Promise<BackstageSignInResult> {
    const userEntityRef = stringifyEntityRef({
      kind: 'User',
      name: email,
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
}
