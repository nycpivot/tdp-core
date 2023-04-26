import React from 'react';
import { Navigate } from 'react-router';
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
  SettingsTabsSurface,
  BannerSurface,
} from '@tpb/core';
import { ToggleRoute } from '@tpb/core-frontend';
import { ApiDuplicatesFinder } from './ApiDuplicatesFinder';

export const appRenderer = (surfaces: SurfaceStoreInterface): React.FC => {
  const apiDuplicatesFinder = new ApiDuplicatesFinder([configApiRef]);
  const deduplicatedApis = surfaces
    .findSurface(ApiSurface)
    .apis.filter(api => !apiDuplicatesFinder.isDuplicate(api));

  const apis: AnyApiFactory[] = [
    createApiFactory({
      api: scmIntegrationsApiRef,
      deps: { configApi: configApiRef },
      factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
    }),
    ScmAuth.createDefaultApiFactory(),
    ...deduplicatedApis,
  ];

  const pluginSurface = surfaces.findSurface(AppPluginSurface);
  const plugins =
    pluginSurface.plugins.length > 0 ? pluginSurface.plugins : undefined;

  const routeSurface = surfaces.findSurface(AppRouteSurface);

  const themeSurface = surfaces.findSurface(ThemeSurface);

  const bannerSurface = surfaces.findSurface(BannerSurface);

  const settingsTabsSurface = surfaces.findSurface(SettingsTabsSurface);

  const app = createApp({
    apis,
    themes: themeSurface.themes(),
    components: surfaces.findSurface(AppComponentSurface).components,
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
      <ToggleRoute
        feature="customize.features.settings.enabled"
        path="/settings"
        element={<UserSettingsPage />}
      >
        {...settingsTabsSurface.tabs}
      </ToggleRoute>
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
      {...bannerSurface.banners}
      <AppRouter>{rootBuilder(routes)}</AppRouter>
    </AppProvider>
  );
};
