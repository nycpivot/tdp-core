import { ApiSurface, AppPluginInterface } from '@tpb/core-frontend';
import {
  ApiRef,
  BackstageIdentityApi,
  ConfigApi,
  OAuthApi,
  ProfileInfoApi,
  SessionApi,
  configApiRef,
  createApiFactory,
  createApiRef,
  discoveryApiRef,
  oauthRequestApiRef,
} from '@backstage/core-plugin-api';
import { OAuth2 } from '@backstage/core-app-api';
import { customizeAuthProviderConfig, LoginSurface } from '@tpb/plugin-login';

export const vmwareCloudServicesAuthProviderKey = 'vmwareCloudServices';

export const vmwareCloudServicesAuthApiRef: ApiRef<
  OAuthApi & ProfileInfoApi & BackstageIdentityApi & SessionApi
> = createApiRef({
  id: 'esback.auth.vmware-cloud-services',
});

export const VMwareCloudServicesAuthPlugin: AppPluginInterface =
  () => surfaces => {
    const defaultConfig = {
      id: 'vmware-cloud-services-auth-provider',
      title: 'VMware Cloud Services',
      message: 'Sign in with your VMware account',
    };

    surfaces.applyTo(LoginSurface, surface => {
      surface.add({
        config: (configApi: ConfigApi) => ({
          ...customizeAuthProviderConfig(
            configApi,
            defaultConfig,
            vmwareCloudServicesAuthProviderKey,
          ),
          apiRef: vmwareCloudServicesAuthApiRef,
        }),
        enabled: (configApi: ConfigApi) =>
          configApi.has(`auth.providers.${vmwareCloudServicesAuthProviderKey}`), // TODO: BCKSTG-180 - needs test for case when config does not exist
        authProviderKey: vmwareCloudServicesAuthProviderKey,
      });
    });

    surfaces.applyTo(ApiSurface, surface => {
      surface.add(
        createApiFactory({
          api: vmwareCloudServicesAuthApiRef,
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
                id: 'vmwareCloudServices',
                title: 'VMware Cloud Services',
                icon: () => null,
              },
              environment: configApi.getOptionalString('auth.environment'),
            }),
        }),
      );
    });
  };
