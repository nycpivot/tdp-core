import React from 'react';
import { Navigate, Route } from 'react-router';
import { UserSettingsPage } from '@backstage/plugin-user-settings';

import { AlertDisplay, OAuthRequestDialog } from '@backstage/core-components';
import { createApp } from '@backstage/app-defaults';
import { FlatRoutes } from '@backstage/core-app-api';
import {
  ScmAuth,
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import {
  AnyApiFactory,
  configApiRef,
  createApiFactory,
} from '@backstage/core-plugin-api';
import {
  ApiSurface,
  AppComponentSurface,
  AppPluginSurface,
  AppRouteSurface,
  SurfaceStoreInterface,
  ThemeSurface,
} from '@esback/core';

export const appRenderer = (surfaces: SurfaceStoreInterface): React.FC => {
  const apis: AnyApiFactory[] = [
    createApiFactory({
      api: scmIntegrationsApiRef,
      deps: { configApi: configApiRef },
      factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
    }),
    ScmAuth.createDefaultApiFactory(),
    ...surfaces.getSurfaceState(ApiSurface).apis,
  ];

  const pluginSurface = surfaces.getSurfaceState(AppPluginSurface);
  const plugins =
    pluginSurface.plugins.length > 0 ? pluginSurface.plugins : undefined;

  const routeSurface = surfaces.getSurfaceState(AppRouteSurface);

  const themeSurface = surfaces.getSurfaceState(ThemeSurface);

  const app = createApp({
    apis,
    themes: themeSurface.themes(),
    components: surfaces.getSurfaceState(AppComponentSurface).components,
    plugins,
    bindRoutes(context) {
      routeSurface.routeBinders.forEach(binder => binder(context));
    },
  });

  const AppProvider = app.getProvider();
  const AppRouter = app.getRouter();

  const routes = (
    <FlatRoutes>
      {routeSurface.defaultRoute && (
        <Navigate key="/" to={routeSurface.defaultRoute} />
      )}
      {...routeSurface.nonDefaultRoutes}
      <Route path="/settings" element={<UserSettingsPage />} />
    </FlatRoutes>
  );

  const rootBuilder = themeSurface.rootBuilder();
  if (!rootBuilder) {
    throw new Error('No root builder available in theme');
  }

  return () => (
    <AppProvider>
      <AlertDisplay />
      <OAuthRequestDialog />
      <AppRouter>{rootBuilder(routes)}</AppRouter>
    </AppProvider>
  );
};
