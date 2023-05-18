import { CatalogApi } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import { TestApiProvider as ApiProvider } from '@backstage/test-utils';
import { AlertApi, alertApiRef } from '@backstage/core-plugin-api';
import {
  AsyncEntityProvider,
  catalogApiRef,
  EntityProvider,
  entityRouteRef,
  starredEntitiesApiRef,
  MockStarredEntitiesApi,
} from '@backstage/plugin-catalog-react';
import { renderInTestApp } from '@backstage/test-utils';
import { fireEvent } from '@testing-library/react';
import React, { FC } from 'react';
import { act } from 'react-dom/test-utils';
import { Route, Routes } from 'react-router';
import { EntityLayout } from './EntityLayout';
import {
  PermissionApi,
  permissionApiRef,
} from '@backstage/plugin-permission-react';

const mockEntity = {
  kind: 'MyKind',
  metadata: {
    name: 'my-entity',
  },
} as Entity;

const TestApiWrapper: FC = ({ children }) => {
  return (
    <ApiProvider
      apis={[
        [catalogApiRef, {} as CatalogApi],
        [alertApiRef, {} as AlertApi],
        [starredEntitiesApiRef, new MockStarredEntitiesApi()],
        [permissionApiRef, {} as PermissionApi],
      ]}
    >
      {children}
    </ApiProvider>
  );
};

describe('EntityLayout', () => {
  it('renders simplest case', async () => {
    const rendered = await renderInTestApp(
      <TestApiWrapper>
        <EntityProvider entity={mockEntity}>
          <EntityLayout>
            <EntityLayout.Route path="/" title="tabbed-test-title">
              <div>tabbed-test-content</div>
            </EntityLayout.Route>
          </EntityLayout>
        </EntityProvider>
      </TestApiWrapper>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(rendered.getByText('my-entity')).toBeInTheDocument();
    expect(rendered.getByText('tabbed-test-title')).toBeInTheDocument();
    expect(rendered.getByText('tabbed-test-content')).toBeInTheDocument();
  });

  it('renders the entity title if defined', async () => {
    const mockEntityWithTitle = {
      kind: 'MyKind',
      metadata: {
        name: 'my-entity',
        title: 'My Entity',
      },
    } as Entity;

    const rendered = await renderInTestApp(
      <TestApiWrapper>
        <EntityProvider entity={mockEntityWithTitle}>
          <EntityLayout>
            <EntityLayout.Route path="/" title="tabbed-test-title">
              <div>tabbed-test-content</div>
            </EntityLayout.Route>
          </EntityLayout>
        </EntityProvider>
      </TestApiWrapper>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(rendered.getByText('My Entity')).toBeInTheDocument();
    expect(rendered.getByText('tabbed-test-title')).toBeInTheDocument();
    expect(rendered.getByText('tabbed-test-content')).toBeInTheDocument();
  });

  it('renders error message when entity is not found', async () => {
    const rendered = await renderInTestApp(
      <TestApiWrapper>
        <AsyncEntityProvider loading={false}>
          <EntityLayout>
            <EntityLayout.Route path="/" title="tabbed-test-title">
              <div>tabbed-test-content</div>
            </EntityLayout.Route>
          </EntityLayout>
        </AsyncEntityProvider>
      </TestApiWrapper>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(rendered.getByText('Warning: Entity not found')).toBeInTheDocument();
    expect(rendered.queryByText('my-entity')).not.toBeInTheDocument();
    expect(rendered.queryByText('tabbed-test-title')).not.toBeInTheDocument();
    expect(rendered.queryByText('tabbed-test-content')).not.toBeInTheDocument();
  });

  it('navigates when user clicks different tab', async () => {
    const rendered = await renderInTestApp(
      <Routes>
        <Route
          path="/*"
          element={
            <TestApiWrapper>
              <EntityProvider entity={mockEntity}>
                <EntityLayout>
                  <EntityLayout.Route path="/" title="tabbed-test-title">
                    <div>tabbed-test-content</div>
                  </EntityLayout.Route>
                  <EntityLayout.Route
                    path="/some-other-path"
                    title="tabbed-test-title-2"
                  >
                    <div>tabbed-test-content-2</div>
                  </EntityLayout.Route>
                </EntityLayout>
              </EntityProvider>
            </TestApiWrapper>
          }
        />
      </Routes>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    const secondTab = rendered.queryAllByRole('tab')[1];
    act(() => {
      fireEvent.click(secondTab);
    });

    expect(rendered.getByText('tabbed-test-title')).toBeInTheDocument();
    expect(rendered.queryByText('tabbed-test-content')).not.toBeInTheDocument();

    expect(rendered.getByText('tabbed-test-title-2')).toBeInTheDocument();
    expect(rendered.queryByText('tabbed-test-content-2')).toBeInTheDocument();
  });

  it('should conditionally render tabs', async () => {
    const shouldRenderTab = (e: Entity) => e.metadata.name === 'my-entity';
    const shouldNotRenderTab = (e: Entity) => e.metadata.name === 'some-entity';

    const rendered = await renderInTestApp(
      <TestApiWrapper>
        <EntityProvider entity={mockEntity}>
          <EntityLayout>
            <EntityLayout.Route path="/" title="tabbed-test-title">
              <div>tabbed-test-content</div>
            </EntityLayout.Route>
            <EntityLayout.Route
              path="/some-other-path"
              title="tabbed-test-title-2"
              if={shouldNotRenderTab}
            >
              <div>tabbed-test-content-2</div>
            </EntityLayout.Route>
            <EntityLayout.Route
              path="/some-other-other-path"
              title="tabbed-test-title-3"
              if={shouldRenderTab}
            >
              <div>tabbed-test-content-3</div>
            </EntityLayout.Route>
          </EntityLayout>
        </EntityProvider>
      </TestApiWrapper>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(rendered.queryByText('tabbed-test-title')).toBeInTheDocument();
    expect(rendered.queryByText('tabbed-test-title-2')).not.toBeInTheDocument();
    expect(rendered.queryByText('tabbed-test-title-3')).toBeInTheDocument();
  });
});
