import { Entity } from '@backstage/catalog-model';
import { entityPage } from '../Catalog/EntityPage';
// eslint-disable-next-line @backstage/no-undeclared-imports
import {
  MockPermissionApi,
  renderInTestApp,
  TestApiProvider as ApiProvider,
} from '@backstage/test-utils';
// eslint-disable-next-line @backstage/no-undeclared-imports
import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
// eslint-disable-next-line @backstage/no-undeclared-imports
import { JsonObject } from '@backstage/types';
// eslint-disable-next-line @backstage/no-undeclared-imports
import { ConfigReader } from '@backstage/config';
import {
  CatalogApi,
  catalogApiRef,
  EntityProvider,
  entityRouteRef,
  MockStarredEntitiesApi,
  starredEntitiesApiRef,
} from '@backstage/plugin-catalog-react';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import React from 'react';
import { orgPlugin } from '@backstage/plugin-org';
import { catalogGraphRouteRef } from '@backstage/plugin-catalog-graph';
import { EntityPageSurface } from '../../EntityPageSurface';

export const renderTestEntityPage = async (
  testEntity: Entity,
  surface: EntityPageSurface,
) => {
  await renderInTestApp(
    <ApiProvider
      apis={[
        [
          scmIntegrationsApiRef,
          ScmIntegrationsApi.fromConfig(
            new ConfigReader({
              integrations: {},
            }),
          ),
        ],
        [starredEntitiesApiRef, new MockStarredEntitiesApi()],
        [
          catalogApiRef,
          {
            getEntityByRef: jest.fn(),
            getEntityAncestors: jest.fn(() => ({ items: [] })),
            getEntities: jest.fn(),
          } as unknown as CatalogApi,
        ],
        [permissionApiRef, new MockPermissionApi()],
      ]}
    >
      <EntityProvider entity={testEntity}>{entityPage(surface)}</EntityProvider>
    </ApiProvider>,
    {
      mountedRoutes: {
        '/catalog/:namespace/:kind/:name': entityRouteRef,
        '/catalog/create': orgPlugin.externalRoutes.catalogIndex,
        '/graph': catalogGraphRouteRef,
      },
    },
  );
};

export const buildTestEntity = (
  kind: string,
  spec: JsonObject = {},
  metadata: JsonObject = {},
): Entity => ({
  apiVersion: 'v1',
  kind,
  metadata: {
    name: 'TestEntity',
    description: 'This is the description',
    ...metadata,
  },
  spec: {
    owner: 'guest',
    ...spec,
  },
  relations: [
    {
      type: 'ownedBy',
      targetRef: 'user:default/guest',
    },
  ],
});
