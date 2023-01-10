import { SignInProviderConfig } from '@backstage/core-components';
import { ConfigApi } from '@backstage/core-plugin-api';

export type ProviderConfig = 'guest' | 'custom' | SignInProviderConfig;

export type Provider = {
  config: ProviderConfig;
  enabled: (configApi: ConfigApi) => boolean;
};

export class LoginSurface {
  private readonly _providers: Provider[] = [];

  public add(provider: Provider) {
    this._providers.push(provider);
  }

  public hasProviders(): boolean {
    return this._providers.length > 0;
  }

  public enabledProviders(configAPI: ConfigApi): ProviderConfig[] {
    return this._providers
      .filter((provider: Provider) => provider.enabled(configAPI))
      .map((provider: Provider) => provider.config);
  }
}
