import React from 'react';
import ReactDOM from 'react-dom';
import {
  AppRouteSurface,
  EsbackPluginInterface,
  SurfaceStoreInterface,
  SurfaceStore,
  ThemeSurface,
} from '@tpb/core';
import { plugin as catalogPlugin } from '@tpb/plugin-catalog';
import { plugin as techdocsPlugin } from '@tpb/plugin-techdocs';
import { plugin as searchPlugin } from '@tpb/plugin-search';
import { plugin as apiDocsPlugin } from '@tpb/plugin-api-docs';
import { plugin as loginPlugin } from '@tpb/plugin-login';
import { plugin as themePlugin } from '@tpb/plugin-backstage-theme';
import { appRenderer } from './appRenderer';

export class AppRuntime {
  private readonly _surfaces: SurfaceStoreInterface;

  constructor(plugins: EsbackPluginInterface[] = []) {
    this._surfaces = new SurfaceStore();

    catalogPlugin()(this._surfaces);
    techdocsPlugin()(this._surfaces);
    searchPlugin()(this._surfaces);
    apiDocsPlugin()(this._surfaces);
    loginPlugin()(this._surfaces);
    this._surfaces.applyTo(AppRouteSurface, routes =>
      routes.setDefault('catalog'),
    );

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
}
