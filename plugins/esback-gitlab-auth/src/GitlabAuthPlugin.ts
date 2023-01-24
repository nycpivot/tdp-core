import { BackendPluginInterface } from '@esback/core';
import { ConfigApi, gitlabAuthApiRef } from '@backstage/core-plugin-api';
import { LoginSurface } from '@esback/plugin-login';

export const GitlabAuthPlugin: BackendPluginInterface = () => surfaces => {
  surfaces.applyTo(LoginSurface, surface => {
    surface.add({
      config: {
        id: 'gitlab-auth-provider',
        title: 'GitLab',
        message: 'Sign in with GitLab',
        apiRef: gitlabAuthApiRef,
      },
      enabled: (configApi: ConfigApi) => configApi.has('auth.providers.gitlab'), // TODO: ESBACK-163 - needs test for case when config does not exist
    });
  });
};
