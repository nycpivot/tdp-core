import { BackendCatalogSurface, BackendPluginInterface } from '@esback/core';
import { CustomProcessor } from './Processor';

export const CatalogProcessorPlugin: BackendPluginInterface =
  () => surfaces => {
    surfaces.applyTo(BackendCatalogSurface, surface => {
      surface.addCatalogProcessor(new CustomProcessor());
    });
  };
