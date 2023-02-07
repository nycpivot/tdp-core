import { SignInProviderConfig } from '@backstage/core-components';
import { ConfigApi } from '@backstage/core-plugin-api';

export type ProviderConfig = 'guest' | 'custom' | SignInProviderConfig;

export type Provider = {
  config: ProviderConfig;
  enabled: (configApi: ConfigApi) => boolean;
  authProviderKey: string;
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
    const configuredProviders = this._providers.filter((provider: Provider) => provider.enabled(configAPI))
    return configuredProviders
      .map((provider: Provider) => {
        const loginConfig = configAPI.getOptionalConfig(`auth.loginPage.${provider.authProviderKey}`)
        if (this.isSignInProviderConfig(provider.config) && loginConfig !== undefined) {
          return {
            id: loginConfig.getOptionalString('id') || provider.config.id,
            title: loginConfig.getOptionalString('title') || provider.config.title,
            message:
              loginConfig.getOptionalString('message') || provider.config.message,
            apiRef: provider.config.apiRef,
          };
        } else {
          return provider.config
        }
      });
  }

  private isSignInProviderConfig(providerConfig: ProviderConfig): providerConfig is SignInProviderConfig {
    return (providerConfig as SignInProviderConfig).id !== undefined;
  }
}
