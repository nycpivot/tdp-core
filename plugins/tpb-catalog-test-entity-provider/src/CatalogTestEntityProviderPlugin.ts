import { BackendCatalogSurface, BackendPluginInterface } from '@tpb/core';
import { CustomEntityProvider } from './CustomEntityProvider';

export const CatalogTestEntityProviderPlugin: BackendPluginInterface =
  () => surfaces => {
    surfaces.applyTo(BackendCatalogSurface, surface => {
      surface.addEntityProviderBuilder(() => new CustomEntityProvider());
    });
  };
