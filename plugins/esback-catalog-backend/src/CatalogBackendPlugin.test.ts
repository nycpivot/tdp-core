import { CatalogBackendPlugin } from './CatalogBackendPlugin';
import {
  BackendCatalogSurface,
  BackendPluginInterface,
  BackendPluginSurface,
  PluginEnvironment,
  SurfaceStore,
} from '@esback/core';
import { ConfigReader } from '@backstage/config';
import {
  CacheManager,
  DatabaseManager,
  FetchUrlReader,
  getVoidLogger,
  ServerTokenManager,
} from '@backstage/backend-common';
import {
  AuthorizeResult,
  DefinitivePolicyDecision,
  PermissionEvaluator,
} from '@backstage/plugin-permission-common';
import request from 'supertest';
import express from 'express';
import {
  DeferredEntity,
  EntityProvider,
} from '@backstage/plugin-catalog-backend';
import { TaskScheduler } from '@backstage/backend-tasks';

describe('Catalog Backend Plugin', () => {
  it('should return entities', async () => {
    const router = await createPluginRouter([fakeEntityProviderPlugin()]);
    const app = express();
    app.use(router);
    await waitForStitching();

    const res = await request(app).get('/entities');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].kind).toBe('Component');
    expect(res.body[0].metadata.name).toBe('fake-entity');
  });

  async function createPluginRouter(
    catalogInternalPlugins: BackendPluginInterface[],
  ) {
    const plugin = createCatalogPlugin(catalogInternalPlugins);
    const router = await plugin.pluginFn(pluginEnvironment());
    return router;
  }

  function createCatalogPlugin(
    catalogInternalPlugins: BackendPluginInterface[],
  ) {
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

  function fakeEntityProvider(): EntityProvider {
    return {
      async connect(connection): Promise<void> {
        const entity: DeferredEntity = {
          entity: {
            kind: 'Component',
            apiVersion: 'backstage.io/v1alpha1',
            metadata: {
              name: 'fake-entity',
              annotations: {
                'backstage.io/managed-by-location': 'url:https://host/path',
                'backstage.io/managed-by-origin-location':
                  'url:https://host/path',
              },
            },
            spec: {
              type: 'website',
              owner: 'esback',
              lifecycle: 'test',
            },
          },
        };
        await connection.applyMutation({
          type: 'full',
          entities: [entity],
        });
        return Promise.resolve(undefined);
      },
      getProviderName(): string {
        return 'fake-provider';
      },
    };
  }

  function fakeEntityProviderPlugin() {
    const entityProviderPlugin: BackendPluginInterface = () => surfaces =>
      surfaces.applyTo(BackendCatalogSurface, surface =>
        surface.addEntityProvider(fakeEntityProvider()),
      );
    return entityProviderPlugin;
  }

  function pluginEnvironment(): PluginEnvironment {
    const config = new ConfigReader({
      backend: {
        database: {
          client: 'better-sqlite3',
          connection: ':memory:',
        },
      },
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
});
