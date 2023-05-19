import React from 'react';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { AlertDisplay, OAuthRequestDialog } from '@backstage/core-components';
import { createApp } from '@backstage/app-defaults';
import { AppRouter, FlatRoutes } from '@backstage/core-app-api';
import {
  ApiSurface,
  AppComponentSurface,
  AppPluginSurface,
  AppRouteSurface,
  BannerSurface,
  SettingsTabsSurface,
  SurfaceStoreInterface,
  ThemeSurface,
} from '@tpb/core';
import { ToggleRoute } from '@tpb/core-frontend';
import { DefaultRoute } from './DefaultRoute';

export const appRenderer = (surfaces: SurfaceStoreInterface) => {
  const pluginSurface = surfaces.findSurface(AppPluginSurface);
  const plugins =
    pluginSurface.plugins.length > 0 ? pluginSurface.plugins : undefined;

  const routeSurface = surfaces.findSurface(AppRouteSurface);

  const themeSurface = surfaces.findSurface(ThemeSurface);

  const bannerSurface = surfaces.findSurface(BannerSurface);

  const settingsTabsSurface = surfaces.findSurface(SettingsTabsSurface);

  const app = createApp({
    apis: surfaces.findSurface(ApiSurface).apis,
    themes: themeSurface.themes(),
    components: surfaces.findSurface(AppComponentSurface).components,
    plugins,
    bindRoutes(context) {
      routeSurface.routeBinders.forEach(binder => binder(context));
    },
  });

  const routes = (
    <FlatRoutes>
      <DefaultRoute routeSurface={routeSurface} />
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

  return app.createRoot(
    <>
      <AlertDisplay />
      <OAuthRequestDialog />
      {...bannerSurface.banners}
      <AppRouter>{rootBuilder(routes)}</AppRouter>
    </>,
  );
};
