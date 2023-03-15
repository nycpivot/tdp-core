import {
  BackendPluginInterface,
  BackendPluginSurface,
  PluginEnvironment,
} from '@tpb/core';

import { CatalogClient } from '@backstage/catalog-client';
import { Router } from 'express';
import { KubernetesBuilder } from '@backstage/plugin-kubernetes-backend';

const createPlugin = () => {
  return async (env: PluginEnvironment): Promise<Router> => {
    const catalogApi = new CatalogClient({ discoveryApi: env.discovery });

    const { router } = await KubernetesBuilder.createBuilder({
      logger: env.logger,
      config: env.config,
      catalogApi,
    }).build();

    return router;
  };
};

export const KubernetesBackendPlugin: BackendPluginInterface = () => surfaces =>
  surfaces.applyTo(BackendPluginSurface, surface => {
    surface.addPlugin({
      name: 'kubernetes',
      pluginFn: createPlugin(),
    });
  });
