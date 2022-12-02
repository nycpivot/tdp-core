import { BackendCatalogSurface, BackendPluginInterface } from '@esback/core';
import {
  GithubEntityProvider,
  GitHubOrgEntityProvider,
} from '@backstage/plugin-catalog-backend-module-github';

const ESBACK_CONFIG_PATH = 'esback.catalog.providers.github';

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

    catalog.addEntityProviderBuilder(env => {
      const orgUrl = env.config.getOptionalString(
        `${ESBACK_CONFIG_PATH}.orgEntity.orgUrl`,
      );

      if (orgUrl === undefined || orgUrl === '') {
        return [];
      }

      const id = env.config.getOptionalString(
        `${ESBACK_CONFIG_PATH}.orgEntity.id`,
      );
      return GitHubOrgEntityProvider?.fromConfig(env.config, {
        id: id || 'production',
        orgUrl: orgUrl,
        logger: env.logger,
        schedule: env.scheduler.createScheduledTaskRunner({
          frequency: { minutes: 60 },
          timeout: { minutes: 15 },
        }),
      });
    });
  });
};
