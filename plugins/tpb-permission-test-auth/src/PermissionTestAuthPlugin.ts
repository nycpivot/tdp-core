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
  ProfileInfoApi,
  SessionApi,
} from '@backstage/core-plugin-api';
import { customizeAuthProviderConfig, LoginSurface } from '@tpb/plugin-login';
import { OAuth2 } from '@backstage/core-app-api';

export const PermissionTestAuthPlugin: AppPluginInterface = () => surfaces => {
  const defaultConfig = {
    id: 'permission-test',
    title: 'Permission Test',
    message:
      'Sign in with Google Auth but configure user identity with revolving names',
  };

  const permissionTestAuthApiRef: ApiRef<
    OAuthApi & ProfileInfoApi & BackstageIdentityApi & SessionApi
  > = createApiRef({
    id: 'core.auth.permission-test',
  });

  surfaces.applyTo(LoginSurface, surface => {
    surface.add({
      config: (configApi: ConfigApi) => ({
        ...customizeAuthProviderConfig(
          configApi,
          defaultConfig,
          'permission-test',
        ),
        apiRef: permissionTestAuthApiRef,
      }),
      enabled: (configApi: ConfigApi) =>
        configApi.has('auth.providers.permission-test'),
      authProviderKey: 'permission-test',
    });
  });

  surfaces.applyTo(ApiSurface, surface => {
    surface.add(
      createApiFactory({
        api: permissionTestAuthApiRef,
        deps: {
          discoveryApi: discoveryApiRef,
          oauthRequestApi: oauthRequestApiRef,
          configApi: configApiRef,
        },
        factory: ({ discoveryApi, oauthRequestApi, configApi }) => {
          const SCOPE_PREFIX = 'https://www.googleapis.com/auth/';
          return OAuth2.create({
            discoveryApi,
            oauthRequestApi,
            provider: {
              id: defaultConfig.id,
              title: defaultConfig.title,
              icon: () => null,
            },
            defaultScopes: [
              'openid',
              `${SCOPE_PREFIX}userinfo.email`,
              `${SCOPE_PREFIX}userinfo.profile`,
            ],
            environment: configApi.getOptionalString('auth.environment'),
            scopeTransform(scopes) {
              return scopes.map(scope => {
                if (scope === 'openid') {
                  return scope;
                }
                if (scope === 'profile' || scope === 'email') {
                  return `${SCOPE_PREFIX}userinfo.${scope}`;
                }
                if (scope.startsWith(SCOPE_PREFIX)) {
                  return scope;
                }
                return `${SCOPE_PREFIX}${scope}`;
              });
            },
          });
        },
      }),
    );
  });
};
