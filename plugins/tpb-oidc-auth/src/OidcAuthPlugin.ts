import { ApiSurface, AppPluginInterface } from '@tpb/core-frontend';
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
import { customizeAuthProviderConfig, LoginSurface } from '@tpb/plugin-login';
import { OAuth2 } from '@backstage/core-app-api';

export const oidcAuthProviderKey = 'oidc';

export const oidcAuthApiRef: ApiRef<
  OAuthApi &
    OpenIdConnectApi &
    ProfileInfoApi &
    BackstageIdentityApi &
    SessionApi
> = createApiRef({
  id: 'esback.auth.oidc',
});

export const OidcAuthPlugin: AppPluginInterface = () => surfaces => {
  const defaultConfig = {
    id: 'oidc-auth-provider',
    title: 'OIDC',
    message: 'Sign in with a custom OIDC',
  };

  surfaces.applyTo(LoginSurface, surface => {
    surface.add({
      config: (configApi: ConfigApi) => ({
        ...customizeAuthProviderConfig(
          configApi,
          defaultConfig,
          oidcAuthProviderKey,
        ),
        apiRef: oidcAuthApiRef,
      }),
      enabled: (configApi: ConfigApi) =>
        configApi.has(`auth.providers.${oidcAuthProviderKey}`), // TODO: ESBACK-163 - needs test for case when config does not exist
      authProviderKey: oidcAuthProviderKey,
    });
  });

  surfaces.applyTo(ApiSurface, surface => {
    surface.add(
      createApiFactory({
        api: oidcAuthApiRef,
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
              id: 'oidc',
              title: 'OIDC',
              icon: () => null,
            },
            defaultScopes: ['openid', 'email', 'profile'],
            environment: configApi.getOptionalString('auth.environment'),
          }),
      }),
    );
  });
};
