import { CatalogClient } from '@backstage/catalog-client';
import { createRouter } from '@tpb/kubernetes-logging-backend';
import { Router } from 'express';
import {
  BackendPluginInterface,
  BackendPluginSurface,
  PluginEnvironment,
} from '@esback/core';

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

export const KubernetesLoggingBackendPlugin: BackendPluginInterface =
  () => surfaces =>
    surfaces.applyTo(BackendPluginSurface, surface => {
      surface.addPlugin({
        name: 'k8s-logging',
        pluginFn: createPlugin(),
      });
    });
