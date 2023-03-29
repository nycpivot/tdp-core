import { CatalogClient } from '@backstage/catalog-client';
import { createRouter } from '@tpb/k8s-custom-apis-backend';
import { Router } from 'express';
import {
  BackendPluginInterface,
  BackendPluginSurface,
  PluginEnvironment,
} from '@tpb/core';

const createPlugin = () => {
  return async ({
    logger,
    config,
    discovery,
  }: PluginEnvironment): Promise<Router> => {
    const catalogApi = new CatalogClient({ discoveryApi: discovery });
    return createRouter({
      logger,
      config,
      catalogApi,
    });
  };
};

export const KubernetesCustomApisPlugin: BackendPluginInterface =
  () => surfaces =>
    surfaces.applyTo(BackendPluginSurface, surface => {
      surface.addPlugin({
        name: 'k8s-logging',
        pluginFn: createPlugin(),
      });
    });
