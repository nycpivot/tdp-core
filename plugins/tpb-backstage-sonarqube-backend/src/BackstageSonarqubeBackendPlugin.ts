import {
  BackendPluginInterface,
  BackendPluginSurface,
  PluginEnvironment,
} from '@tpb/core-backend';
import { Router } from 'express';
import {
  createRouter,
  DefaultSonarqubeInfoProvider,
} from '@backstage/plugin-sonarqube-backend';

const createPlugin = () => {
  return async (env: PluginEnvironment): Promise<Router> => {
    return await createRouter({
      logger: env.logger,
      sonarqubeInfoProvider: DefaultSonarqubeInfoProvider.fromConfig(
        env.config,
      ),
    });
  };
};

export const BackstageSonarqubeBackendPlugin: BackendPluginInterface =
  () => surfaces =>
    surfaces.applyTo(BackendPluginSurface, surface => {
      surface.addPlugin({
        name: 'sonarqube',
        pluginFn: createPlugin(),
      });
    });
