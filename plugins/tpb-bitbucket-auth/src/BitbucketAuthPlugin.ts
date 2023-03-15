import { BackendPluginInterface } from '@tpb/core';
import { ConfigApi, bitbucketAuthApiRef } from '@backstage/core-plugin-api';
import { customizeAuthProviderConfig, LoginSurface } from '@tpb/plugin-login';

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
