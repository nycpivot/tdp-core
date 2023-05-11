import { BackendPluginInterface } from '@tpb/core';
import { ConfigApi, bitbucketAuthApiRef } from '@backstage/core-plugin-api';
import { customizeAuthProviderConfig, LoginSurface } from '@tpb/plugin-login';

export const bitbucketAuthProviderKey = 'bitbucket';

export const BitbucketAuthPlugin: BackendPluginInterface = () => surfaces => {
  const defaultConfig = {
    id: 'bitbucket-auth-provider',
    title: 'Bitbucket',
    message: 'Sign in with Bitbucket OAuth',
  };

  surfaces.applyTo(LoginSurface, surface => {
    surface.add({
      config: (configApi: ConfigApi) => ({
        ...customizeAuthProviderConfig(
          configApi,
          defaultConfig,
          bitbucketAuthProviderKey,
        ),
        apiRef: bitbucketAuthApiRef,
      }),
      enabled: (configApi: ConfigApi) =>
        configApi.has(`auth.providers.${bitbucketAuthProviderKey}`), // TODO: ESBACK-163 - needs test for case when config does not exist
      authProviderKey: bitbucketAuthProviderKey,
    });
  });
};
