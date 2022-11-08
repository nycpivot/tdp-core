import { BackendPluginInterface, BackendPluginSurface } from '@esback/core';
import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { Router } from 'express';
import { PluginEnvironment, BackendCatalogSurface } from '@esback/core';

const catalog = (surface: BackendCatalogSurface) => {
  return async (env: PluginEnvironment): Promise<Router> => {
    const builder = await CatalogBuilder.create(env);
    builder.addProcessor(surface.processors);
    const { processingEngine, router } = await builder.build();
    await processingEngine.start();
    return router;
  };
};

export const CatalogBackendPlugin: BackendPluginInterface = () => surfaces =>
  surfaces.applyWithDependency(
    BackendPluginSurface,
    BackendCatalogSurface,
    (plugins, catalogSurface) => {
      plugins.addPlugin({
        name: 'catalog',
        pluginFn: catalog(catalogSurface),
      });
    },
  );
