import { BackendCatalogSurface, BackendPluginInterface } from '@esback/core';
import { CustomEntityProvider } from './CustomEntityProvider';

export const TestEntityProviderPlugin: BackendPluginInterface =
  () => surfaces => {
    surfaces.applyTo(BackendCatalogSurface, surface => {
      surface.addEntityProviderBuilder(() => new CustomEntityProvider());
    });
  };
