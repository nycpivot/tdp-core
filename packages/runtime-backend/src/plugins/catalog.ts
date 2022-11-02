import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { Router } from 'express';
import {
  SurfaceStore,
  PluginEnvironment,
  CatalogProcessorSurface,
} from '@esback/core';

export default function esbackCatalogPlugin(surfaces: SurfaceStore) {
  return async (env: PluginEnvironment): Promise<Router> => {
    const builder = await CatalogBuilder.create(env);
    builder.addProcessor(
      surfaces.getSurfaceState(CatalogProcessorSurface).processors,
    );
    const { processingEngine, router } = await builder.build();
    await processingEngine.start();
    return router;
  };
}
