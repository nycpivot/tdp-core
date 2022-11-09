import { BackendCatalogSurface, BackendPluginInterface } from '@esback/core';
import { CustomEntityProvider } from './EntityProvider';

export const CatalogEntityProviderPlugin: BackendPluginInterface =
  () => surfaces => {
    surfaces.applyTo(BackendCatalogSurface, surface => {
      surface.addEntityProvider(new CustomEntityProvider());
    });
  };
