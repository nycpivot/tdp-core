import { AppSurfaces } from "@esback/core";
import React from "react"
import ReactDOM from 'react-dom';
import { buildBackstageApp } from './AppBuilder'

const loadSurfaces = async (): Promise<AppSurfaces> => {
  const surfaces: AppSurfaces = new AppSurfaces()
  surfaces.routeSurface.setDefault("catalog")

  const { GitlabPlugin } = await import('@internal/plugin-esback-gitlab')
  GitlabPlugin(surfaces)

  const { KubernetesPlugin } = await import('@internal/plugin-esback-kubernetes')
  KubernetesPlugin(surfaces)

  // WARNING: Catalog targetting plugins need to be added before the catalog plugin
  const { CatalogPlugin } = await import('@internal/plugin-esback-catalog')
  CatalogPlugin(surfaces)

  const { GraphiQLPlugin } = await import('@internal/plugin-esback-graphiql')
  GraphiQLPlugin(surfaces)

  const { TechRadarPlugin } = await import('@internal/plugin-esback-techradar')
  TechRadarPlugin(surfaces)

  const { TechDocsPlugin } = await import("@internal/plugin-esback-techdocs")
  TechDocsPlugin(surfaces)

  return surfaces
} 

export default () => {
  loadSurfaces()
    .then(surfaces => {
      const App = buildBackstageApp(surfaces)
      ReactDOM.render(<App />, document.getElementById('root'))
    })
}