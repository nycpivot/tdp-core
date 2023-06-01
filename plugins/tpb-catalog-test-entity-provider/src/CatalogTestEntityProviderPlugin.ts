import {
  BackendCatalogSurface,
  BackendPluginInterface,
} from '@tpb/core-backend';
import { CustomEntityProvider } from './CustomEntityProvider';

export const CatalogTestEntityProviderPlugin: BackendPluginInterface =
  () => surfaces => {
    surfaces.applyTo(BackendCatalogSurface, surface => {
      surface.addEntityProviderBuilder(() => new CustomEntityProvider());
    });
  };
