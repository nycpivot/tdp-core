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
}
