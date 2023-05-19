import React from 'react';
import ReactDOM from 'react-dom';
import {
  TpbPluginInterface,
  SurfaceStoreInterface,
  SurfaceStore,
  ThemeSurface,
  ApiSurface,
} from '@tpb/core';
import { plugin as scmPlugin } from '@tpb/plugin-scm';
import { plugin as catalogPlugin } from '@tpb/plugin-catalog';
import { plugin as techdocsPlugin } from '@tpb/plugin-techdocs';
import { plugin as searchPlugin } from '@tpb/plugin-search';
import { plugin as apiDocsPlugin } from '@tpb/plugin-api-docs';
import { plugin as loginPlugin } from '@tpb/plugin-login';
import { plugin as themePlugin } from '@tpb/plugin-backstage-theme';
import { appRenderer } from './appRenderer';
import {
  appThemeApiRef,
  configApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';

export class AppRuntime {
  private readonly _surfaces: SurfaceStoreInterface;

  constructor(plugins: TpbPluginInterface[] = []) {
    this._surfaces = new SurfaceStore();
    this.configureApiSurface();
    catalogPlugin()(this._surfaces);
    techdocsPlugin()(this._surfaces);
    searchPlugin()(this._surfaces);
    apiDocsPlugin()(this._surfaces);
    loginPlugin()(this._surfaces);
    scmPlugin()(this._surfaces);

    plugins.forEach(plugin => plugin(this._surfaces));

    const themeSurface = this._surfaces.findSurface(ThemeSurface);
    if (themeSurface.isNotConfigured()) {
      themePlugin()(this._surfaces);
    }
  }

  public render() {
    const App = appRenderer(this._surfaces);
    ReactDOM.render(<App />, document.getElementById('root'));
  }

  public get surfaces(): SurfaceStoreInterface {
    return this._surfaces;
  }

  // We have to configure the api surface here: doing it in @tpb/core breaks the app
  // (it looks like it breaks the backend side probably because we are mixing
  // web & backend stuff in @tpb/core => improvement: split the backend & frontend
  // stuff in @tpb/core into two different packages)
  private configureApiSurface() {
    ApiSurface.apisToIgnore = [
      // the following apis are registered in [this file](https://github.com/backstage/backstage/blob/8ee31f38bfb2fd7c416fb8da9472fd46f0a7e664/packages/core-app-api/src/app/AppManager.tsx#L428) -> no way found to get them before creating our app
      // note that we don't include the featureFlagsApiRef because it can be replaced
      // we also don't include the backstage default apis here for the same reason TBC
      // (those that are listed [here](https://github.com/backstage/backstage/blob/master/packages/app-defaults/src/defaults/apis.ts)) TBC
      appThemeApiRef.id,
      configApiRef.id,
      identityApiRef.id,
    ];
  }
}
