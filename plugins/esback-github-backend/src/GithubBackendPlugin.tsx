import { BackendCatalogSurface, BackendPluginInterface } from '@esback/core';
import { GithubEntityProvider } from '@backstage/plugin-catalog-backend-module-github';

export const GithubBackendPlugin: BackendPluginInterface = () => surfaces => {
  surfaces.applyTo(BackendCatalogSurface, surface => {
    surface.addEntityProviderBuilder(env =>
      GithubEntityProvider.fromConfig(env.config, {
        logger: env.logger,
        schedule: env.scheduler.createScheduledTaskRunner({
          frequency: { minutes: 30 },
          timeout: { minutes: 3 },
        }),
        scheduler: env.scheduler,
      }),
    );
  });
};
