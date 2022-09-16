
import { KubernetesBuilder } from '@backstage/plugin-kubernetes-backend';
import { CatalogClient } from '@backstage/catalog-client';
import { BackendPluginInterface, PluginEnvironment } from "@tanzu/backstage-core"
import { Router } from "express";

const kubernetes = async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogApi = new CatalogClient({ discoveryApi: env.discovery });
  const { router } = await KubernetesBuilder.createBuilder({
    logger: env.logger,
    config: env.config,
    catalogApi,
  }).build();
  return router;
}

export const KubernetesBackendPlugin: BackendPluginInterface = (config) =>
  (context) => context.pluginSurface.addPlugin({
    name: "kubernetes",
    pluginFn: kubernetes,
    ...config,
  })