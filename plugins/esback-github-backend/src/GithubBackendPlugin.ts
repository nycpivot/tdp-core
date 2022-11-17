import { BackendCatalogSurface, BackendPluginInterface } from '@esback/core';
import {
  GithubEntityProvider,
  GitHubOrgEntityProvider,
} from '@backstage/plugin-catalog-backend-module-github';

export const GithubBackendPlugin: BackendPluginInterface = () => surfaces => {
  surfaces.applyTo(BackendCatalogSurface, catalog => {
    catalog.addEntityProviderBuilder(env =>
      GithubEntityProvider.fromConfig(env.config, {
        logger: env.logger,
        schedule: env.scheduler.createScheduledTaskRunner({
          frequency: { minutes: 30 },
          timeout: { minutes: 3 },
        }),
        scheduler: env.scheduler,
      }),
    );

    catalog.addEntityProviderBuilder(env =>
      GitHubOrgEntityProvider?.fromConfig(env.config, {
        id: 'production',
        orgUrl: 'https://cmbu-githubent01.eng.vmware.com/esback',
        logger: env.logger,
        schedule: env.scheduler.createScheduledTaskRunner({
          frequency: { minutes: 60 },
          timeout: { minutes: 15 },
        }),
      }),
    );
  });
};
