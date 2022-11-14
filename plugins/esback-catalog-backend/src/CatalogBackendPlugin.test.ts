import { CatalogBackendPlugin } from './CatalogBackendPlugin';
import {
  BackendCatalogSurface,
  BackendPluginInterface,
  BackendPluginSurface,
  EntityProviderBuilder,
  EsbackPluginInterface,
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
  CatalogProcessor,
  DeferredEntity,
} from '@backstage/plugin-catalog-backend';
import { TaskScheduler } from '@backstage/backend-tasks';
import { Entity } from '@backstage/catalog-model';
import {
  CatalogProcessorEmit,
  LocationSpec,
  processingResult,
} from '@backstage/plugin-catalog-node';
import { JsonObject } from '@backstage/types';

describe('Catalog Backend Plugin', () => {
  it('should return entities from entity providers', async () => {
    const app = await createApp([fakeEntityProviderPlugin()], {
      entityName: 'fake-provider-entity',
    });

    const res = await request(app).get('/entities');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].kind).toBe('Component');
    expect(res.body[0].metadata.name).toBe('fake-provider-entity');
  });

  it('should return entities from catalog processors', async () => {
    const app = await createApp([fakeCatalogProcessorPlugin()], {
      catalog: {
        locations: [
          {
            type: 'fake-processor',
            target: 'fake-target',
          },
        ],
      },
    });

    const res = await request(app).get('/entities');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(2);
    const components = res.body.filter((e: Entity) => e.kind === 'Component');
    expect(components).toHaveLength(1);
    expect(components[0].metadata.name).toBe('fake-processor-entity');
    const locations = res.body.filter((e: Entity) => e.kind === 'Location');
    expect(locations).toHaveLength(1);
  });
});

async function createApp(
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

function fakeCatalogProcessor(): CatalogProcessor {
  return {
    getProcessorName(): string {
      return 'fake-processor';
    },

    async readLocation(
      location: LocationSpec,
      _optional: boolean,
      emit: CatalogProcessorEmit,
    ): Promise<boolean> {
      if (location.type !== 'fake-processor') {
        return false;
      }

      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'fake-processor-entity',
        },
        spec: {
          type: 'service',
          lifecycle: 'experimental',
          owner: 'guests',
        },
      };

      emit(processingResult.entity(location, entity));

      return true;
    },
  };
}

function fakeEntityProviderBuilder(): EntityProviderBuilder {
  return env => [
    {
      async connect(connection): Promise<void> {
        const entity: DeferredEntity = {
          entity: {
            kind: 'Component',
            apiVersion: 'backstage.io/v1alpha1',
            metadata: {
              name: env.config.get('entityName'),
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
    },
  ];
}

function fakeEntityProviderPlugin() {
  const entityProviderPlugin: BackendPluginInterface = () => surfaces =>
    surfaces.applyTo(BackendCatalogSurface, surface =>
      surface.addEntityProviderBuilder(fakeEntityProviderBuilder()),
    );
  return entityProviderPlugin;
}

function fakeCatalogProcessorPlugin() {
  const catalogProcessorPlugin: BackendPluginInterface = () => surfaces =>
    surfaces.applyTo(BackendCatalogSurface, surface =>
      surface.addCatalogProcessor(fakeCatalogProcessor()),
    );
  return catalogProcessorPlugin;
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
