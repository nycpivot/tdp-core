import Router from 'express-promise-router';
import {
  createServiceBuilder,
  loadBackendConfig,
  getRootLogger,
  useHotMemoize,
  notFoundHandler,
  CacheManager,
  DatabaseManager,
  SingleHostDiscovery,
  UrlReaders,
  ServerTokenManager,
} from '@backstage/backend-common';
import { TaskScheduler } from '@backstage/backend-tasks';
import { Config } from '@backstage/config';
import { ServerPermissionClient } from '@backstage/plugin-permission-node';
import { BackendSurfaces, PluginEnvironment } from '@esback/core';

function makeCreateEnv(config: Config) {
  const root = getRootLogger();
  const reader = UrlReaders.default({ logger: root, config });
  const discovery = SingleHostDiscovery.fromConfig(config);
  const cacheManager = CacheManager.fromConfig(config);
  const databaseManager = DatabaseManager.fromConfig(config);
  const tokenManager = ServerTokenManager.noop();
  const taskScheduler = TaskScheduler.fromConfig(config);
  const permissions = ServerPermissionClient.fromConfig(config, {
    discovery,
    tokenManager,
  });

  root.info(`Created UrlReader ${reader}`);

  return (plugin: string): PluginEnvironment => {
    const logger = root.child({ type: 'plugin', plugin });
    const database = databaseManager.forPlugin(plugin);
    const cache = cacheManager.forPlugin(plugin);
    const scheduler = taskScheduler.forPlugin(plugin);
    return {
      logger,
      database,
      cache,
      config,
      reader,
      discovery,
      tokenManager,
      scheduler,
      permissions,
    };
  };
}

async function main(surfaces: BackendSurfaces) {
  const config = await loadBackendConfig({
    argv: process.argv,
    logger: getRootLogger(),
  });

  const createEnv = makeCreateEnv(config);
  const apiRouter = Router();

  for ( var [ pluginName, pluginFn ] of surfaces.pluginSurface.plugins.entries()) {
    const pluginEnv = useHotMemoize(module, () => createEnv(pluginName));
    apiRouter.use(`/${pluginName}`, await pluginFn(pluginEnv))
  }

  // Add backends ABOVE this line; this 404 handler is the catch-all fallback
  apiRouter.use(notFoundHandler());

  const service = createServiceBuilder(module)
    .loadConfig(config)
    .addRouter('/api', apiRouter)

  // Setup the frontend side
  if (surfaces.pluginSurface.mainApp) {
    const appEnv = useHotMemoize(module, () => createEnv('app'));
    service.addRouter('', await surfaces.pluginSurface.mainApp(appEnv))
  }

  await service.start().catch(err => {
    console.log(err);
    process.exit(1);
  });
}

export const BackendRunner = (surfaces: BackendSurfaces) => {
  module.hot?.accept();

  main(surfaces)
    .catch(error => {
      console.error(`Backend failed to start up, ${error}`);
      process.exit(1);
    });
}
