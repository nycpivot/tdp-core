import React from 'react';
import ReactDOM from 'react-dom';
import { AppSurfaces, AppPluginExport } from '@tanzu/esback-core';
import { default as CatalogPlugin } from '@tanzu/plugin-backstage-catalog'
import { AppRenderer } from './AppRenderer'

export class AppRuntime {
  private readonly _surfaces: AppSurfaces

  constructor(pluginExports: AppPluginExport[]) {
    this._surfaces = new AppSurfaces()
    const plugins = [CatalogPlugin(), ...pluginExports]

    this._surfaces.routeSurface.setDefault("catalog")

    // The entityPage surfaces need to be applied before routes
    plugins.forEach(({ entityPage }) => {
      if (entityPage) {
        entityPage(this._surfaces.entityPageSurface)
      }
    })
    
    plugins.forEach(({apis, components, plugins, routes, sidebarItems}) => {
      apis && apis(this._surfaces.apiSurface)
      components && components(this._surfaces.componentSurface)
      plugins && plugins(this._surfaces.pluginSurface)
      routes && routes(this._surfaces.routeSurface, this._surfaces)
      sidebarItems && sidebarItems(this._surfaces.sidebarItemSurface)
    })

    return this
  }

  public render() {
    const App = AppRenderer(this._surfaces)
    ReactDOM.render(<App />, document.getElementById('root'))
  }

  public get surfaces(): AppSurfaces {
    return this._surfaces
  }
}