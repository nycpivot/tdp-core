import '@backstage/cli/asset-types';
import { AppPluginExport, AppSurfaces } from "@tanzu/backstage-core";
import React from "react"
import ReactDOM from 'react-dom';
import { AppRuntime } from '@tanzu/backstage-runtime'

const loadSurfaces = async (): Promise<AppSurfaces> => {
  const surfaces: AppSurfaces = new AppSurfaces()

  const pluginExports: AppPluginExport[] = []

  // The entityPage surfaces need to be applied before catalog
  pluginExports.forEach(({ entityPage }) => {
    if (entityPage) {
      entityPage(surfaces.entityPageSurface)
    }
  })
  
  pluginExports.forEach(({apis, components, plugins, routes, sidebarItems}) => {
    apis && apis(surfaces.apiSurface)
    components && components(surfaces.componentSurface)
    plugins && plugins(surfaces.pluginSurface)
    routes && routes(surfaces.routeSurface, surfaces)
    sidebarItems && sidebarItems(surfaces.sidebarItemSurface)
  })

  surfaces.routeSurface.setDefault("catalog")
  return surfaces
} 

loadSurfaces()
  .then(surfaces => {
    const App = AppRuntime.mainApp(surfaces)
    ReactDOM.render(<App />, document.getElementById('root'))
  })