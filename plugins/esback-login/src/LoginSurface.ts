import { SignInProviderConfig } from '@backstage/core-components';
import { ConfigApi } from '@backstage/core-plugin-api';

export type ProviderConfig = 'guest' | 'custom' | SignInProviderConfig;

export type Provider = {
  config: (configApi: ConfigApi) => ProviderConfig;
  enabled: (configApi: ConfigApi) => boolean;
  authProviderKey: string;
};

export type CustomizableProviderFields = Pick<
  SignInProviderConfig,
  'id' | 'title' | 'message'
>;

export function customizeAuthProviderConfig(
  configAPI: ConfigApi,
  defaultProviderConfig: Omit<SignInProviderConfig, 'apiRef'>,
  providerKey: string,
): CustomizableProviderFields {
  const loginConfig = configAPI.getOptionalConfig(
    `auth.loginPage.${providerKey}`,
  );

  return {
    id: loginConfig?.getOptionalString('id') || defaultProviderConfig.id,
    title:
      loginConfig?.getOptionalString('title') || defaultProviderConfig.title,
    message:
      loginConfig?.getOptionalString('message') ||
      defaultProviderConfig.message,
  };
}

export class LoginSurface {
  private readonly _providers: Provider[] = [];

  public add(provider: Provider): void {
    this._providers.push(provider);
  }

  public hasProviders(): boolean {
    return this._providers.length > 0;
  }

  public enabledProviders(configApi: ConfigApi): ProviderConfig[] {
    return this._providers
      .filter((provider: Provider) => provider.enabled(configApi))
      .map((provider: Provider) => provider.config(configApi));
  }
}
