import React from 'react';
import ReactDOM from 'react-dom';
import { AppSurfaces, AppPluginExport } from '@esback/core';
import { plugin as catalogPlugin } from '@esback/plugin-catalog';
import { appRenderer } from './appRenderer';

export class AppRuntime {
  private readonly _surfaces: AppSurfaces;

  constructor(pluginExports: AppPluginExport[] = []) {
    this._surfaces = new AppSurfaces();
    const appPlugins = [catalogPlugin(), ...pluginExports];

    this._surfaces.routeSurface.setDefault('catalog');

    // The entityPage surfaces need to be applied before routes
    appPlugins.forEach(({ entityPage }) => {
      if (entityPage) {
        entityPage(this._surfaces.entityPageSurface);
      }
    });

    appPlugins.forEach(
      ({ apis, components, plugins, routes, sidebarItems }) => {
        if (apis) apis(this._surfaces.apiSurface);
        if (components) components(this._surfaces.componentSurface);
        if (plugins) plugins(this._surfaces.pluginSurface);
        if (routes) routes(this._surfaces.routeSurface, this._surfaces);
        if (sidebarItems) sidebarItems(this._surfaces.sidebarItemSurface);
      },
    );

    return this;
  }

  public render() {
    const App = appRenderer(this._surfaces);
    ReactDOM.render(<App />, document.getElementById('root'));
  }

  public get surfaces(): AppSurfaces {
    return this._surfaces;
  }
}
