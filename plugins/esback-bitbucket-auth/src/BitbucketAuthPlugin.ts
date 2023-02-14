import { BackendPluginInterface } from '@esback/core';
import { ConfigApi, bitbucketAuthApiRef } from '@backstage/core-plugin-api';
import { LoginSurface } from '@esback/plugin-login';
import { customizeAuthProviderConfig } from '@esback/plugin-login/src/LoginSurface';

export const BitbucketAuthPlugin: BackendPluginInterface = () => surfaces => {
  const defaultConfig = {
    id: 'bitbucket-auth-provider',
    title: 'Bitbucket',
    message: 'Sign in with Bitbucket OAuth',
  };

  surfaces.applyTo(LoginSurface, surface => {
    surface.add({
      config: (configApi: ConfigApi) => ({
        ...customizeAuthProviderConfig(configApi, defaultConfig, 'onelogin'),
        apiRef: bitbucketAuthApiRef,
      }),
      enabled: (configApi: ConfigApi) =>
        configApi.has('auth.providers.bitbucket'), // TODO: ESBACK-163 - needs test for case when config does not exist
      authProviderKey: 'bitbucket',
    });
  });
};
