import React from 'react';
import ReactDOM from 'react-dom';
import {
  AppRouteSurface,
  EsbackPluginInterface,
  SurfaceStore,
} from '@esback/core';
import { plugin as catalogPlugin } from '@esback/plugin-catalog';
import { appRenderer } from './appRenderer';

export class AppRuntime {
  private readonly _surfaces: SurfaceStore;

  constructor(pluginExports: EsbackPluginInterface[] = []) {
    this._surfaces = new SurfaceStore();
    catalogPlugin()(this._surfaces);
    this._surfaces.applyTo(AppRouteSurface, routes =>
      routes.setDefault('catalog'),
    );
    pluginExports.forEach(pe => pe(this._surfaces));
  }

  public render() {
    const App = appRenderer(this._surfaces);
    ReactDOM.render(<App />, document.getElementById('root'));
  }

  public get surfaces(): SurfaceStore {
    return this._surfaces;
  }
}
