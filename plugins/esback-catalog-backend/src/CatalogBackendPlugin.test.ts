import {CatalogBackendPlugin} from "./CatalogBackendPlugin";
import {
  BackendCatalogSurface,
  BackendPluginInterface,
  BackendPluginSurface,
  PluginEnvironment,
  SurfaceStore
} from "@esback/core";
import {ConfigReader} from '@backstage/config';
import {createLogger, transports} from "winston";
import {DatabaseManager} from "@backstage/backend-common";
import {AuthorizeResult, DefinitivePolicyDecision, PermissionEvaluator} from "@backstage/plugin-permission-common";
import request from 'supertest';
import express from "express";
import {DeferredEntity} from "@backstage/plugin-catalog-backend";

describe("Catalog Backend Plugin", () => {
  it('should return entities', async () => {
    const plugin = CatalogBackendPlugin();
    const entityProviderPlugin: BackendPluginInterface = () => surfaces =>
      surfaces.applyTo(BackendCatalogSurface, surface => surface.addEntityProvider({
        async connect(connection): Promise<void> {
          const entity: DeferredEntity = {
            entity: {
              kind: 'Component',
              apiVersion: "backstage.io/v1alpha1",
              metadata: {
                name: "fake-entity",
                annotations: {
                  'backstage.io/managed-by-location': 'url:https://host/path',
                  'backstage.io/managed-by-origin-location': 'url:https://host/path',
                },
              },
              spec: {
                type: 'website',
                owner: 'esback',
                lifecycle: 'test'
              }
            }
          };
          await connection.applyMutation({
            type: 'full',
            entities: [entity]
          })
          return Promise.resolve(undefined);
        },
        getProviderName(): string {
          return "fake-provider";
        }
      }))
    const store = new SurfaceStore()
    entityProviderPlugin()(store)
    plugin(store)

    const surface = store.getSurfaceState(BackendPluginSurface);
    expect(surface.plugins.length).toBe(1)
    const p = surface.plugins[0];
    const config = new ConfigReader({
      backend: {
        database: {
          client: 'better-sqlite3',
          connection: ':memory:'
        }
      }
    });

    const database = DatabaseManager.fromConfig(config).forPlugin("catalog");
    const env: PluginEnvironment = {
      logger: createLogger({level: "verbose", transports: new transports.Console()}),
      config: config,
      database: database,
      permissions: new class implements PermissionEvaluator {
        authorize(requests, options) {
          const decision: DefinitivePolicyDecision = {
            result: AuthorizeResult.ALLOW
          };
          return Promise.resolve([decision]);
        }

        authorizeConditional(requests, options) {
          const decision: DefinitivePolicyDecision = {
            result: AuthorizeResult.ALLOW
          };
          return Promise.resolve([decision]);
        }
      }
    }

    const router = await p.pluginFn(env)
    const app = express();
    app.use(router);

    // waiting for the catalog processor to refresh the database
    // the polling intervall is hardcoded to 1 second in backstage (CatalogBuilder class)
    // and doesn't seem overridable from the tests hence the usage
    // of a timeout here (until we find a better way to trigger the
    // entities refresh in the database)
    await new Promise(resolve => setTimeout(resolve, 1500))

    const res = await request(app).get('/entities')
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].kind).toBe("Component");
    expect(res.body[0].metadata.name).toBe("fake-entity");
  })
})