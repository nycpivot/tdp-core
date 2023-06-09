import { CatalogClient } from '@backstage/catalog-client';
import { createRouter } from '@tpb/k8s-custom-apis-backend';
import { ServerTokenManager } from '@backstage/backend-common';
import { ServerPermissionClient } from '@backstage/plugin-permission-node';
import { Router } from 'express';
import {
  BackendPluginInterface,
  BackendPluginSurface,
  PluginEnvironment,
} from '@tpb/core-backend';

const createPlugin = () => {
  return async ({
    logger,
    config,
    discovery,
  }: PluginEnvironment): Promise<Router> => {
    const catalogApi = new CatalogClient({ discoveryApi: discovery });
    const tokenManager = ServerTokenManager.fromConfig(config, {
      logger,
    });
    const permissions = ServerPermissionClient.fromConfig(config, {
      discovery,
      tokenManager,
    });
    return createRouter({
      logger,
      config,
      catalogApi,
      permissions,
    });
  };
};

export const KubernetesCustomApisPlugin: BackendPluginInterface =
  () => surfaces =>
    surfaces.applyTo(BackendPluginSurface, surface => {
      surface.addPlugin({
        name: 'k8s-custom-apis',
        pluginFn: createPlugin(),
      });
    });
