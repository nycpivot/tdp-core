import {
  BackendCatalogSurface,
  BackendPluginInterface,
  PluginEnvironment,
} from '@tpb/core';
import { MicrosoftGraphOrgReaderProcessor } from '@backstage/plugin-catalog-backend-module-msgraph';
import { MicrosoftGraphOrgReaderProcessorTransformersSurface } from './MicrosoftGraphOrgReaderProcessorTransformersSurface';

export const MicrosoftGraphOrgReaderProcessorPlugin: BackendPluginInterface =
  () => surfaces => {
    surfaces.applyWithDependency(
      BackendCatalogSurface,
      MicrosoftGraphOrgReaderProcessorTransformersSurface,
      (
        backendCatalogSurface,
        microsoftGraphOrgReaderProcessorTransformersSurface,
      ) => {
        backendCatalogSurface.addCatalogProcessorBuilder(
          (env: PluginEnvironment) => {
            return MicrosoftGraphOrgReaderProcessor.fromConfig(env.config, {
              logger: env.logger,
              userTransformer:
                microsoftGraphOrgReaderProcessorTransformersSurface.userTransformer(),
              groupTransformer:
                microsoftGraphOrgReaderProcessorTransformersSurface.groupTransformer(),
              organizationTransformer:
                microsoftGraphOrgReaderProcessorTransformersSurface.organizationTransformer(),
            });
          },
        );
      },
    );
  };
