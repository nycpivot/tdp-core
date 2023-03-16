import {
  AuthResolverContext,
  SignInInfo,
  SignInResolver,
} from '@backstage/plugin-auth-backend';

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
}
