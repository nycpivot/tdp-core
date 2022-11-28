import { BackendCatalogSurface, BackendPluginInterface } from '@esback/core';
import { CustomProcessor } from './CustomProcessor';

export const TestEntityProcessorPlugin: BackendPluginInterface =
  () => surfaces => {
    surfaces.applyTo(BackendCatalogSurface, surface => {
      surface.addCatalogProcessorBuilder(() => new CustomProcessor());
    });
  };
