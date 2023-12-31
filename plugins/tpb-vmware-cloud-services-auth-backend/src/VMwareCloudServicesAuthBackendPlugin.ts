import { BackendPluginInterface } from '@tpb/core-backend';
import { SignInProviderSurface } from '@tpb/plugin-auth-backend';
import {
  AuthProviderFactory,
  AuthProviderRouteHandlers,
  OAuthAdapter,
  OAuthEnvironmentHandler,
  createAuthProviderIntegration,
} from '@backstage/plugin-auth-backend';

import { VMwareCloudServicesAuthProvider } from './provider';

export const VMwareCloudServicesAuthBackendPlugin: BackendPluginInterface =
  () => surfaceStore => {
    surfaceStore.applyTo(SignInProviderSurface, providerSurface => {
      providerSurface.add({
        vmwareCloudServices: createAuthProviderIntegration({
          create:
            (): AuthProviderFactory =>
            ({
              providerId,
              globalConfig,
              config,
              resolverContext,
            }): AuthProviderRouteHandlers =>
              OAuthEnvironmentHandler.mapConfig(config, envConfig => {
                const callbackUrl = `${globalConfig.baseUrl}/${providerId}/handler/frame`;
                return OAuthAdapter.fromConfig(
                  globalConfig,
                  new VMwareCloudServicesAuthProvider({
                    clientId: envConfig.getString('clientId'),
                    callbackUrl,
                    organizationId:
                      envConfig.getOptionalString('organizationId'),
                    resolverContext,
                  }),
                  { providerId, callbackUrl },
                );
              }),
        }).create(),
      });
    });
  };
