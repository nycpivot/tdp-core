import { BackendCatalogSurface, BackendPluginInterface } from '@tpb/core';
import {
  GitlabDiscoveryEntityProvider,
  GitLabDiscoveryProcessor,
} from '@backstage/plugin-catalog-backend-module-gitlab';

export const GitlabDiscoveryEntityProviderPlugin: BackendPluginInterface =
  () => surfaces => {
    surfaces.applyTo(BackendCatalogSurface, surface => {
      surface.addEntityProviderBuilder(env =>
        GitlabDiscoveryEntityProvider.fromConfig(env.config, {
          logger: env.logger,
          schedule: env.scheduler.createScheduledTaskRunner({
            frequency: { minutes: 30 },
            timeout: { minutes: 3 },
          }),
        }),
      );

      surface.addCatalogProcessorBuilder(env =>
        GitLabDiscoveryProcessor.fromConfig(env.config, { logger: env.logger }),
      );
    });
  };
