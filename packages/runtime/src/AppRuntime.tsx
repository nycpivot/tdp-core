import React from 'react';
import ReactDOM from 'react-dom';
import {
  AppRouteSurface,
  EsbackPluginInterface,
  SurfaceStore,
} from '@esback/core';
import { plugin as catalogPlugin } from '@esback/plugin-catalog';
import { plugin as techdocsPlugin } from '@esback/plugin-techdocs';
import { plugin as searchPlugin } from '@esback/plugin-search';
import { plugin as apiDocsPlugin } from '@esback/plugin-api-docs';
import { plugin as loginPlugin } from '@esback/plugin-login';
import { appRenderer } from './appRenderer';
import './style/clarity.css';

export class AppRuntime {
  private readonly _surfaces: SurfaceStore;

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
  }

  public render() {
    const App = appRenderer(this._surfaces);
    ReactDOM.render(<App />, document.getElementById('root'));
  }

  public get surfaces(): SurfaceStore {
    return this._surfaces;
  }
}
