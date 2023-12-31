import {
  BackendCatalogSurface,
  BackendPluginInterface,
} from '@tpb/core-backend';
import { AzureDevOpsDiscoveryProcessor } from '@backstage/plugin-catalog-backend-module-azure';

export const AzureDevOpsPlugin: BackendPluginInterface = () => surfaces => {
  surfaces.applyTo(BackendCatalogSurface, surface => {
    surface.addCatalogProcessorBuilder(env =>
      AzureDevOpsDiscoveryProcessor.fromConfig(env.config, {
        logger: env.logger,
      }),
    );
  });
};
