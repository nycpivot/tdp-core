import { BackendPluginInterface } from '@esback/core';
import { ConfigApi, gitlabAuthApiRef } from '@backstage/core-plugin-api';
import { LoginSurface } from '@esback/plugin-login';
import { customizeAuthProviderConfig } from '@esback/plugin-login/src/LoginSurface';

export const GitlabAuthPlugin: BackendPluginInterface = () => surfaces => {
  const defaultConfig = {
    id: 'gitlab-auth-provider',
    title: 'GitLab',
    message: 'Sign in with GitLab',
  };

  surfaces.applyTo(LoginSurface, surface => {
    surface.add({
      config: (configApi: ConfigApi) => ({
        ...customizeAuthProviderConfig(configApi, defaultConfig, 'gitlab'),
        apiRef: gitlabAuthApiRef,
      }),
      enabled: (configApi: ConfigApi) => configApi.has('auth.providers.gitlab'), // TODO: ESBACK-163 - needs test for case when config does not exist
      authProviderKey: 'gitlab',
    });
  });
};
