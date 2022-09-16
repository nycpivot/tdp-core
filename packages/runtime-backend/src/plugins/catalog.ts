import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { Router } from 'express';
import { BackendSurfaces, PluginEnvironment } from '@tanzu/backstage-core';

export default function esbackCatalogPlugin(surfaces: BackendSurfaces) {
  return async (env: PluginEnvironment): Promise<Router> => {
    const builder = await CatalogBuilder.create(env);
    builder.addProcessor(surfaces.catalogProcessorSurface.processors);
    const { processingEngine, router } = await builder.build();
    await processingEngine.start();
    return router;
  }
}
