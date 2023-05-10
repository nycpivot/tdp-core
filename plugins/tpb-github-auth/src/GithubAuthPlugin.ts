import { BackendPluginInterface } from '@tpb/core';
import { ConfigApi, githubAuthApiRef } from '@backstage/core-plugin-api';
import { customizeAuthProviderConfig, LoginSurface } from '@tpb/plugin-login';

export const githubAuthProviderKey = 'github';
export const GithubAuthPlugin: BackendPluginInterface = () => surfaces => {
  const defaultConfig = {
    id: 'github-auth-provider',
    title: 'GitHub',
    message: 'Sign in with GitHub',
  };

  surfaces.applyTo(LoginSurface, surface => {
    surface.add({
      config: (configApi: ConfigApi) => ({
        ...customizeAuthProviderConfig(
          configApi,
          defaultConfig,
          githubAuthProviderKey,
        ),
        apiRef: githubAuthApiRef,
      }),
      enabled: (configApi: ConfigApi) =>
        configApi.has(`auth.providers.${githubAuthProviderKey}`), // TODO: ESBACK-163 - needs test for case when config does not exist
      authProviderKey: githubAuthProviderKey,
    });
  });
};
