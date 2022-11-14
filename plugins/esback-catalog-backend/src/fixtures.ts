import {
  BackendPluginInterface,
  BackendPluginSurface,
  EsbackPluginInterface,
  PluginEnvironment,
  SurfaceStore,
} from '@esback/core';
import { JsonObject } from '@backstage/types';
import express from 'express';
import { CatalogBackendPlugin } from './CatalogBackendPlugin';
import { ConfigReader } from '@backstage/config';
import {
  AuthorizeResult,
  DefinitivePolicyDecision,
  PermissionEvaluator,
} from '@backstage/plugin-permission-common';
import {
  CacheManager,
  DatabaseManager,
  FetchUrlReader,
  getVoidLogger,
  ServerTokenManager,
} from '@backstage/backend-common';
import { TaskScheduler } from '@backstage/backend-tasks';

export async function createApp(
  plugins: (() => EsbackPluginInterface)[],
  extraConfig: JsonObject,
) {
  const router = await createPluginRouter(plugins, extraConfig);
  const app = express();
  app.use(router);
  await waitForStitching();
  return app;
}

async function createPluginRouter(
  catalogInternalPlugins: BackendPluginInterface[],
  extraConfig: JsonObject,
) {
  const plugin = createCatalogPlugin(catalogInternalPlugins);
  const router = await plugin.pluginFn(pluginEnvironment(extraConfig));
  return router;
}

function createCatalogPlugin(catalogInternalPlugins: BackendPluginInterface[]) {
  const catalogPlugin = CatalogBackendPlugin();
  const store = new SurfaceStore();
  catalogInternalPlugins.forEach(p => p()(store));
  catalogPlugin(store);

  const surface = store.getSurfaceState(BackendPluginSurface);
  return surface.plugins[0];
}

async function waitForStitching() {
  // waiting for the catalog processor to refresh the database
  // the polling intervall is hardcoded to 1 second in backstage (CatalogBuilder class)
  // and doesn't seem overridable from the tests hence the usage
  // of a timeout here (until we find a better way to trigger the
  // entities refresh in the database)
  await new Promise(resolve => setTimeout(resolve, 1500));
}

function pluginEnvironment(extraConfig: JsonObject): PluginEnvironment {
  const config = new ConfigReader({
    backend: {
      database: {
        client: 'better-sqlite3',
        connection: ':memory:',
      },
    },
    ...extraConfig,
  });

  function permissionEvaluator() {
    return new (class implements PermissionEvaluator {
      // @ts-ignore
      authorize(requests, options) {
        return Promise.resolve([]);
      }

      // @ts-ignore
      authorizeConditional(requests, options) {
        const decision: DefinitivePolicyDecision = {
          result: AuthorizeResult.ALLOW,
        };
        return Promise.resolve([decision]);
      }
    })();
  }

  return {
    logger: getVoidLogger(),
    config: config,
    database: DatabaseManager.fromConfig(config).forPlugin('catalog'),
    permissions: permissionEvaluator(),
    cache: CacheManager.fromConfig(config).forPlugin('catalog'),
    discovery: {
      getBaseUrl: jest.fn(),
      getExternalBaseUrl: jest.fn(),
    },
    reader: new FetchUrlReader(),
    scheduler: TaskScheduler.fromConfig(config).forPlugin('catalog'),
    tokenManager: ServerTokenManager.noop(),
  };
}
