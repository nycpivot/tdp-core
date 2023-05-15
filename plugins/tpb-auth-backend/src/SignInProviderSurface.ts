export type SignInProvider = {};

export class SignInProviderSurface {
  public static readonly id = 'SignInProviderSurface';
  private _signInProviders = {};

  public add(signInProvider: SignInProvider) {
    this._signInProviders = {
      ...signInProvider,
      ...this._signInProviders,
    };
  }

  public allSignInProviders() {
    return this._signInProviders;
  }
}
