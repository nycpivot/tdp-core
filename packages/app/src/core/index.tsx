import { AppPluginExport, AppSurfaces } from "@esback/core";
import React from "react"
import ReactDOM from 'react-dom';
import { buildBackstageApp } from './AppBuilder'

const loadSurfaces = async (): Promise<AppSurfaces> => {
  const surfaces: AppSurfaces = new AppSurfaces()
  surfaces.routeSurface.setDefault("catalog")

  const pluginExports: AppPluginExport[] = [
    (await import('@internal/plugin-esback-catalog')).default(),
    (await import('@internal/plugin-esback-api-docs')).default(),
    (await import('@internal/plugin-esback-gitlab')).default(),
    (await import('@internal/plugin-esback-graphiql')).default(),
    (await import('@internal/plugin-esback-kubernetes')).default(),
    (await import('@internal/plugin-esback-scaffolder')).default(),
    (await import('@internal/plugin-esback-techdocs')).default(),
    (await import('@internal/plugin-esback-techradar')).default(),
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

  return surfaces
} 

export default () => {
  loadSurfaces()
    .then(surfaces => {
      const App = buildBackstageApp(surfaces)
      ReactDOM.render(<App />, document.getElementById('root'))
    })
}