import React from 'react';
import { Navigate, Route } from 'react-router';
import { apiDocsPlugin, ApiExplorerPage } from '@backstage/plugin-api-docs';
import {
  catalogImportPlugin,
} from '@backstage/plugin-catalog-import';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { SearchPage } from '@backstage/plugin-search';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { searchPage } from '../components/search/SearchPage';
import { Root } from '../components/Root';

import { AlertDisplay, OAuthRequestDialog } from '@backstage/core-components';
import { createApp } from '@backstage/app-defaults';
import { FlatRoutes } from '@backstage/core-app-api';
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
    ...surfaces.apiSurface.apis
  ];

  const plugins = surfaces.pluginSurface.plugins.length > 0 ? surfaces.pluginSurface.plugins : undefined

  const app = createApp({
    apis,
    components: surfaces.componentSurface.components,
    plugins,
    bindRoutes(context) {
      surfaces.routeSurface.routeBinders.forEach(binder => binder(context))

      const { bind } = context
      bind(apiDocsPlugin.externalRoutes, {
        registerApi: catalogImportPlugin.routes.importPage,
      });
      bind(scaffolderPlugin.externalRoutes, {
        registerComponent: catalogImportPlugin.routes.importPage,
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
      <Route path="/api-docs" element={<ApiExplorerPage />} />
      <Route path="/search" element={<SearchPage />}>
        {searchPage}
      </Route>
      <Route path="/settings" element={<UserSettingsPage />} />
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
