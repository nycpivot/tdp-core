import {
  BackendCatalogSurface,
  BackendPluginInterface,
} from '@tpb/core-backend';
import { CustomProcessor } from './CustomProcessor';

export const CatalogTestEntityProcessorPlugin: BackendPluginInterface =
  () => surfaces => {
    surfaces.applyTo(BackendCatalogSurface, surface => {
      surface.addCatalogProcessorBuilder(() => new CustomProcessor());
    });
  };
