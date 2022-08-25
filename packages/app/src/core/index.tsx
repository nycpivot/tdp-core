import { AppPluginExport, AppSurfaces } from "@esback/core";
import React from "react"
import ReactDOM from 'react-dom';
import { buildBackstageApp } from './AppBuilder'

const loadSurfaces = async (): Promise<AppSurfaces> => {
  const surfaces: AppSurfaces = new AppSurfaces()

  const pluginExports: AppPluginExport[] = [
    (await import('@internal/plugin-esback-catalog')).default(),
    // {{esback:plugin:imports}}
  ]

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

export default () => {
  loadSurfaces()
    .then(surfaces => {
      const App = buildBackstageApp(surfaces)
      ReactDOM.render(<App />, document.getElementById('root'))
    })
}