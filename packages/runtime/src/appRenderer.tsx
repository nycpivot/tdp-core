import React from 'react';
import { Navigate } from 'react-router';
import { UserSettingsPage } from '@backstage/plugin-user-settings';

import { AlertDisplay, OAuthRequestDialog } from '@backstage/core-components';
import { createApp } from '@backstage/app-defaults';
import { FlatRoutes } from '@backstage/core-app-api';
import {
  ScmAuth,
  scmAuthApiRef,
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import {
  AnyApiFactory,
  appThemeApiRef,
  configApiRef,
  createApiFactory,
  identityApiRef,
} from '@backstage/core-plugin-api';
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
import { ApiDeduplicator } from './ApiDeduplicator';

export const appRenderer = (surfaces: SurfaceStoreInterface): React.FC => {
  const apiDeduplicator = new ApiDeduplicator([
    // the following apis are hardcoded in this renderer or do we want them to be replaceable by some api in ApiSurface ?
    scmIntegrationsApiRef,
    scmAuthApiRef,

    // the following apis are registered in [this file](https://github.com/backstage/backstage/blob/8ee31f38bfb2fd7c416fb8da9472fd46f0a7e664/packages/core-app-api/src/app/AppManager.tsx#L428) -> no way found to get them before creating our app
    // note that we don't include the featureFlagsApiRef because it can be replaced
    // we also don't include the backstage default apis here for the same reason TBC
    // (those that are listed [here](https://github.com/backstage/backstage/blob/master/packages/app-defaults/src/defaults/apis.ts)) TBC
    appThemeApiRef,
    configApiRef,
    identityApiRef,
  ]);
  const apis: AnyApiFactory[] = [
    createApiFactory({
      api: scmIntegrationsApiRef,
      deps: { configApi: configApiRef },
      factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
    }),
    ScmAuth.createDefaultApiFactory(),
    ...apiDeduplicator.deduplicate(surfaces.findSurface(ApiSurface).apis),
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
