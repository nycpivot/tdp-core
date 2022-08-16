import React from 'react';
import { Navigate, Route } from 'react-router';
import { apiDocsPlugin, ApiExplorerPage } from '@backstage/plugin-api-docs';
import {
  catalogPlugin,
} from '@backstage/plugin-catalog';
import {
  catalogImportPlugin,
} from '@backstage/plugin-catalog-import';
import { ScaffolderPage, scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { orgPlugin } from '@backstage/plugin-org';
import { SearchPage } from '@backstage/plugin-search';
import { TechRadarPage } from '@backstage/plugin-tech-radar';
import {
  TechDocsIndexPage,
  techdocsPlugin,
  TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
import { ReportIssue } from '@backstage/plugin-techdocs-module-addons-contrib';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { searchPage } from '../components/search/SearchPage';
import { Root } from '../components/Root';

import { AlertDisplay, OAuthRequestDialog } from '@backstage/core-components';
import { createApp } from '@backstage/app-defaults';
import { FlatRoutes } from '@backstage/core-app-api';
import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';
import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
  ScmAuth,
} from '@backstage/integration-react';
import {
  AnyApiFactory,
  configApiRef,
  createApiFactory,
} from '@backstage/core-plugin-api';
import { AppSurfaces, AppSurfacesContext } from '@esback/core';

export const buildBackstageApp = (surfaces: AppSurfaces) => {
  const apis: AnyApiFactory[] = [
    createApiFactory({
      api: scmIntegrationsApiRef,
      deps: { configApi: configApiRef },
      factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
    }),
    ScmAuth.createDefaultApiFactory(),
  ];

  const app = createApp({
    apis,
    bindRoutes({ bind }) {
      bind(catalogPlugin.externalRoutes, {
        createComponent: scaffolderPlugin.routes.root,
        viewTechDoc: techdocsPlugin.routes.docRoot,
      });
      bind(apiDocsPlugin.externalRoutes, {
        registerApi: catalogImportPlugin.routes.importPage,
      });
      bind(scaffolderPlugin.externalRoutes, {
        registerComponent: catalogImportPlugin.routes.importPage,
      });
      bind(orgPlugin.externalRoutes, {
        catalogIndex: catalogPlugin.routes.catalogIndex,
      });
    },
  });

  const AppProvider = app.getProvider();
  const AppRouter = app.getRouter();

  const routes = (
    <FlatRoutes>
      { surfaces.routeSurface.defaultRoute && (
          <Navigate key="/" to={surfaces.routeSurface.defaultRoute}/>
      )}
      { ...surfaces.routeSurface.nonDefaultRoutes }
      <Route path="/docs" element={<TechDocsIndexPage />} />
      <Route
        path="/docs/:namespace/:kind/:name/*"
        element={<TechDocsReaderPage />}
      >
        <TechDocsAddons>
          <ReportIssue />
        </TechDocsAddons>
      </Route>
      <Route path="/create" element={<ScaffolderPage />} />
      <Route path="/api-docs" element={<ApiExplorerPage />} />
      <Route
        path="/tech-radar"
        element={<TechRadarPage width={1500} height={800} />}
      />
      <Route path="/search" element={<SearchPage />}>
        {searchPage}
      </Route>
      <Route path="/settings" element={<UserSettingsPage />} />
      <Route path="/catalog-graph" element={<CatalogGraphPage />} />
    </FlatRoutes>
  );

  return () => (
    <AppSurfacesContext.Provider value={surfaces}>
      <AppProvider>
        <AlertDisplay />
        <OAuthRequestDialog />
        <AppRouter>
        <Root surfaces={surfaces}>{routes}</Root>
        </AppRouter>
      </AppProvider>
    </AppSurfacesContext.Provider>
  );
}

export const loadSurfaces = async (): Promise<AppSurfaces> => {
  const surfaces: AppSurfaces = new AppSurfaces()
  surfaces.routeSurface.setDefault("catalog")

  // Catalog targetting plugins need to be added before the catalog plugin
  const { KubernetesPlugin } = await import('@internal/plugin-esback-kubernetes')
  KubernetesPlugin(surfaces)

  const { CatalogPlugin } = await import('@internal/plugin-esback-catalog')
  CatalogPlugin(surfaces)

  const { GraphiQLPlugin } = await import('@internal/plugin-esback-graphiql')
  GraphiQLPlugin(surfaces)

  return surfaces
} 

