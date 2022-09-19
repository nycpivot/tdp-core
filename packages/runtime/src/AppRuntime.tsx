import React from 'react';
import ReactDOM from 'react-dom';
import { Navigate, Route } from 'react-router';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { Root } from './Root';

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
import { AppSurfaces, AppSurfacesContext, AppPluginExport } from '@tanzu/esback-core';
import { default as CatalogPlugin } from '@tanzu/plugin-backstage-catalog'

const getMainApp = (surfaces: AppSurfaces): React.FC => {
  // Include catalog plugin by default
  const catalogPlugin = CatalogPlugin()
  catalogPlugin?.routes!(surfaces.routeSurface, surfaces)
  catalogPlugin?.sidebarItems!(surfaces.sidebarItemSurface)

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

export const AppRuntime = {
  init: (pluginExports: AppPluginExport[]) => {
    const surfaces: AppSurfaces = new AppSurfaces()

    // The entityPage surfaces need to be applied before catalog
    pluginExports.forEach(({ entityPage }) => {
      if (entityPage) {
        entityPage(surfaces.entityPageSurface)
      }
    })
    
    pluginExports.forEach(({apis, components, plugins, routes, sidebarItems}) => {
      apis && apis(surfaces.apiSurface)
      components && components(surfaces.componentSurface)
      plugins && plugins(surfaces.pluginSurface)
      routes && routes(surfaces.routeSurface, surfaces)
      sidebarItems && sidebarItems(surfaces.sidebarItemSurface)
    })

    surfaces.routeSurface.setDefault("catalog")

    const App = getMainApp(surfaces)
    ReactDOM.render(<App />, document.getElementById('root'))
  }
}