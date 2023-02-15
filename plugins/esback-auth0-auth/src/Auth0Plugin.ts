import { ApiSurface, BackendPluginInterface } from '@esback/core';
import {
  ApiRef,
  BackstageIdentityApi,
  ConfigApi,
  configApiRef,
  createApiFactory,
  createApiRef,
  discoveryApiRef,
  OAuthApi,
  oauthRequestApiRef,
  OpenIdConnectApi,
  ProfileInfoApi,
  SessionApi,
} from '@backstage/core-plugin-api';
import { OAuth2 } from '@backstage/core-app-api';
import { LoginSurface } from '@esback/plugin-login';
import { customizeAuthProviderConfig } from '@esback/plugin-login/src/LoginSurface';

export const auth0AuthApiRef: ApiRef<
  OAuthApi &
    OpenIdConnectApi &
    ProfileInfoApi &
    BackstageIdentityApi &
    SessionApi
> = createApiRef({
  id: 'esback.auth.auth0',
});

export const Auth0Plugin: BackendPluginInterface = () => surfaces => {
  const defaultConfig = {
    id: 'auth0-auth-provider',
    title: 'Auth0',
    message: 'Sign in with Auth0',
  };

  surfaces.applyTo(LoginSurface, surface => {
    surface.add({
      config: (configApi: ConfigApi) => ({
        ...customizeAuthProviderConfig(configApi, defaultConfig, 'auth0'),
        apiRef: auth0AuthApiRef,
      }),
      enabled: (configApi: ConfigApi) => configApi.has('auth.providers.auth0'), // TODO: ESBACK-163 - needs test for case when config does not exist
      authProviderKey: 'auth0',
    });
  });

  surfaces.applyTo(ApiSurface, surface => {
    surface.add(
      createApiFactory({
        api: auth0AuthApiRef,
        deps: {
          discoveryApi: discoveryApiRef,
          oauthRequestApi: oauthRequestApiRef,
          configApi: configApiRef,
        },
        factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
          OAuth2.create({
            discoveryApi,
            oauthRequestApi,
            provider: {
              id: 'auth0',
              title: 'Auth0',
              icon: () => null,
            },
            defaultScopes: ['openid', 'email', 'profile', 'offline_access'],
            environment: configApi.getOptionalString('auth.environment'),
          }),
      }),
    );
  });
};
