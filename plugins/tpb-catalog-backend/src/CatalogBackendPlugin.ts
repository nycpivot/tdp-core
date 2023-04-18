import {
  BackendCatalogSurface,
  BackendPluginInterface,
  BackendPluginSurface,
  PluginEnvironment,
} from '@tpb/core';
import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { Router } from 'express';

const catalog = (surface: BackendCatalogSurface) => {
  return async (env: PluginEnvironment): Promise<Router> => {
    const builder = await CatalogBuilder.create(env);
    builder.addEntityProvider(surface.buildProviders(env));
    builder.addProcessor(surface.buildProcessors(env));
    const { processingEngine, router } = await builder.build();
    const routers = surface.buildRouters(env);
    for (const item of routers) {
      router.use(await item);
    }
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
