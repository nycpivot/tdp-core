import { CatalogClient } from '@backstage/catalog-client';
import { createRouter, ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import { BackendPluginInterface, PluginEnvironment } from '@tanzu/backstage-core';

const scaffolder = async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogClient = new CatalogClient({
    discoveryApi: env.discovery,
  });

  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    reader: env.reader,
    catalogClient,
  });
}

export const ScaffolderBackendPlugin: BackendPluginInterface = (config) =>
  (context) => {
    context.catalogProcessorSurface.addCatalogProcessor(new ScaffolderEntitiesProcessor())
    context.pluginSurface.addPlugin({
      name: "scaffolder", 
      pluginFn: scaffolder,
      ...config,
    })
  }