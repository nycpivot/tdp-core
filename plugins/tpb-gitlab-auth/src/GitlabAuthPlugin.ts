import { BackendPluginInterface } from '@tpb/core';
import { ConfigApi, gitlabAuthApiRef } from '@backstage/core-plugin-api';
import { customizeAuthProviderConfig, LoginSurface } from '@tpb/plugin-login';

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
