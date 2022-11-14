import request from 'supertest';
import { Entity } from '@backstage/catalog-model';
import { createApp } from './fixtures';
import {
  BackendCatalogSurface,
  BackendPluginInterface,
  CatalogProcessorBuilder,
  EntityProviderBuilder,
} from '@esback/core';
import { DeferredEntity } from '@backstage/plugin-catalog-backend';
import {
  CatalogProcessorEmit,
  LocationSpec,
  processingResult,
} from '@backstage/plugin-catalog-node';

describe('Catalog Backend Plugin', () => {
  describe('Entity Providers', () => {
    it('should return components', async () => {
      const app = await createApp([fakeEntityProviderPlugin()], {
        entityName: 'fake-provider-entity',
      });

      const res = await request(app).get('/entities');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].kind).toBe('Component');
      expect(res.body[0].metadata.name).toBe('fake-provider-entity');
    });

    function fakeEntityProviderPlugin() {
      const entityProviderPlugin: BackendPluginInterface = () => surfaces =>
        surfaces.applyTo(BackendCatalogSurface, surface =>
          surface.addEntityProviderBuilder(fakeEntityProviderBuilder()),
        );
      return entityProviderPlugin;
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
  });

  describe('Catalog Processors', () => {
    it('should return components and locations', async () => {
      const app = await createApp([fakeCatalogProcessorPlugin()], {
        entityName: 'fake-processor-entity',
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

    function fakeCatalogProcessorPlugin() {
      const catalogProcessorPlugin: BackendPluginInterface = () => surfaces =>
        surfaces.applyTo(BackendCatalogSurface, surface =>
          surface.addCatalogProcessorBuilder(fakeCatalogProcessorBuilder()),
        );
      return catalogProcessorPlugin;
    }

    function fakeCatalogProcessorBuilder(): CatalogProcessorBuilder {
      return env => [
        {
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
                name: env.config.get('entityName'),
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
        },
      ];
    }
  });
});
