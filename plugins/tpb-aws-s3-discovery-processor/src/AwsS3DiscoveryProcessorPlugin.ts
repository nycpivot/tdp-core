import {
  BackendCatalogSurface,
  BackendPluginInterface,
  PluginEnvironment,
} from '@tpb/core';
import { AwsS3DiscoveryProcessor } from '@backstage/plugin-catalog-backend-module-aws';

export const AwsS3DiscoveryProcessorPlugin: BackendPluginInterface =
  () => surfaces => {
    surfaces.applyTo(BackendCatalogSurface, backendCatalogSurface => {
      backendCatalogSurface.addCatalogProcessorBuilder(
        (env: PluginEnvironment) => {
          return new AwsS3DiscoveryProcessor(env.reader);
        },
      );
    });
  };
