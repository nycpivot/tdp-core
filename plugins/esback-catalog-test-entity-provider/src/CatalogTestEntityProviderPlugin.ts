import { BackendCatalogSurface, BackendPluginInterface } from '@esback/core';
import { CustomEntityProvider } from './CustomEntityProvider';

export const CatalogTestEntityProviderPlugin: BackendPluginInterface =
  () => surfaces => {
    surfaces.applyTo(BackendCatalogSurface, surface => {
      surface.addEntityProviderBuilder(() => new CustomEntityProvider());
    });
  };
