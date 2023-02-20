import { BackendPluginInterface } from '@esback/core';
import { ConfigApi, githubAuthApiRef } from '@backstage/core-plugin-api';
import {
  LoginSurface,
  customizeAuthProviderConfig,
} from '@esback/plugin-login';

export const GithubAuthPlugin: BackendPluginInterface = () => surfaces => {
  const defaultConfig = {
    id: 'github-auth-provider',
    title: 'GitHub',
    message: 'Sign in with GitHub',
  };

  surfaces.applyTo(LoginSurface, surface => {
    surface.add({
      config: (configApi: ConfigApi) => ({
        ...customizeAuthProviderConfig(configApi, defaultConfig, 'github'),
        apiRef: githubAuthApiRef,
      }),
      enabled: (configApi: ConfigApi) => configApi.has('auth.providers.github'), // TODO: ESBACK-163 - needs test for case when config does not exist
      authProviderKey: 'github',
    });
  });
};
