import { BackendPluginInterface } from '@esback/core';
import { ConfigApi, bitbucketAuthApiRef } from '@backstage/core-plugin-api';
import { LoginSurface } from '@esback/plugin-login';

export const BitbucketAuthPlugin: BackendPluginInterface = () => surfaces => {
  surfaces.applyTo(LoginSurface, surface => {
    surface.add({
      config: {
        id: 'bitbucket-auth-provider',
        title: 'Bitbucket',
        message: 'Sign in with Bitbucket OAuth',
        apiRef: bitbucketAuthApiRef,
      },
      enabled: (configApi: ConfigApi) => configApi.has('auth.providers.bitbucket'), // TODO: ESBACK-163 - needs test for case when config does not exist
      authProviderKey: 'bitbucket'
    });
  });
};
