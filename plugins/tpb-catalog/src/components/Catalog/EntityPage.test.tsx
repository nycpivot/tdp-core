import React, { FC } from 'react';
import {
  Entity,
  EntityLink,
  RELATION_OWNED_BY,
} from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/core-app-api';
import { TestApiProvider as ApiProvider } from '@backstage/test-utils';
import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import { renderInTestApp, MockPermissionApi } from '@backstage/test-utils';
import {
  CatalogApi,
  catalogApiRef,
  EntityProvider,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { orgPlugin } from '@backstage/plugin-org';
import { entityPage } from './EntityPage';
import { techdocsPlugin } from '@backstage/plugin-techdocs';
import { JsonObject } from '@backstage/types';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import { catalogGraphRouteRef } from '@backstage/plugin-catalog-graph';

const viewTechDocRouteRef = techdocsPlugin.routes.docRoot;

const buildTestEntity = (
  kind: string,
  spec: JsonObject | undefined = undefined,
  links: EntityLink[] | undefined = undefined,
): Entity => ({
  apiVersion: 'v1',
  kind,
  metadata: {
    name: 'TestEntity',
    description: 'This is the description',
    links,
  },
  spec: {
    owner: 'guest',
    ...spec,
  },
  relations: [
    {
      type: RELATION_OWNED_BY,
      targetRef: 'user:default/guest',
    },
  ],
});

const TestApiWrapper: FC = ({ children }) => {
  return (
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
        [catalogApiRef, { getEntityByRef: jest.fn() } as unknown as CatalogApi],
        [permissionApiRef, new MockPermissionApi()],
      ]}
    >
      {children}
    </ApiProvider>
  );
};

describe('EntityPage app', () => {
  it('renders entity with links', async () => {
    const testEntity = buildTestEntity(
      'Component',
      {
        owner: 'guest',
        lifecycle: 'production',
      },
      [{ url: 'https://links.example.com', title: 'Example Link' }],
    );

    const { findByText } = await renderInTestApp(
      <TestApiWrapper>
        <EntityProvider entity={testEntity}>{entityPage}</EntityProvider>
      </TestApiWrapper>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
          '/docs/:namespace/:kind/:name': viewTechDocRouteRef,
          '/catalog/create': orgPlugin.externalRoutes.catalogIndex,
          '/graph': catalogGraphRouteRef,
        },
      },
    );

    expect(await findByText('Example Link')).toBeInTheDocument();
  });

  it('renders system with api info', async () => {
    const testEntity = buildTestEntity('System');

    const { findByText } = await renderInTestApp(
      <TestApiWrapper>
        <EntityProvider entity={testEntity}>{entityPage}</EntityProvider>
      </TestApiWrapper>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
          '/docs/:namespace/:kind/:name': viewTechDocRouteRef,
          '/catalog/create': orgPlugin.externalRoutes.catalogIndex,
          '/graph': catalogGraphRouteRef,
        },
      },
    );

    expect(await findByText('APIs', { selector: 'h2' })).toBeInTheDocument();
    expect(
      await findByText('This system does not contain any APIs.'),
    ).toBeInTheDocument();
  });
});
