import { BackendCatalogSurface, BackendPluginInterface } from '@esback/core';
import { CustomProcessor } from './CustomProcessor';

export const CatalogTestEntityProcessorPlugin: BackendPluginInterface =
  () => surfaces => {
    surfaces.applyTo(BackendCatalogSurface, surface => {
      surface.addCatalogProcessorBuilder(() => new CustomProcessor());
    });
  };
