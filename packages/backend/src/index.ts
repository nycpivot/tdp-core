/*
 * Hi!
 *
 * Note that this is an EXAMPLE Backstage backend. Please check the README.
 *
 * Happy hacking!
 */

import app from './plugins/app';
import auth from './plugins/auth';
import catalog from './plugins/catalog';
import proxy from './plugins/proxy';
import search from './plugins/search';
import { BackendSurfaces } from "@esback/core";
import { BackendRunner } from "./core/BackendRunner"

async function loadConfiguredPlugins(surfaces: BackendSurfaces): Promise<BackendSurfaces> {
  const { KubernetesBackendPlugin } = await import('@internal/plugin-esback-kubernetes-backend')
  KubernetesBackendPlugin(surfaces)

  const { TechDocsBackendPlugin } = await import('@internal/plugin-esback-techdocs-backend')
  TechDocsBackendPlugin(surfaces)

  return surfaces
}

const surfaces = new BackendSurfaces()
surfaces.pluginSurface.setMainApp(app)
surfaces.pluginSurface.setPlugin("auth", auth)
surfaces.pluginSurface.setPlugin("proxy", proxy)
surfaces.pluginSurface.setPlugin("search", search)

loadConfiguredPlugins(surfaces)
  .then(ctx => {
    surfaces.pluginSurface.setPlugin("catalog", catalog(ctx))
    BackendRunner(ctx)
  })