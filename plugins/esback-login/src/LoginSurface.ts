import { SignInProviderConfig } from '@backstage/core-components';

export type Provider = 'guest' | 'custom' | SignInProviderConfig;

export class LoginSurface {
  private readonly _providers: Provider[] = [];

  public add(provider: Provider) {
    this._providers.push(provider);
  }

  public allProviders(): Provider[] {
    return this._providers;
  }
}
