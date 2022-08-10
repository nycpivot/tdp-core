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
import scaffolder from './plugins/scaffolder';
import proxy from './plugins/proxy';
import techdocs from './plugins/techdocs';
import search from './plugins/search';
import { BackendSurfaces, BackendRunner } from "@internal/plugin-esback-builder-backend";
// import { ESBackBackendPluginIntegration as kubernetes } from "@internal/plugin-esback-kubernetes"

async function loadConfiguredPlugins(surfaces: BackendSurfaces): Promise<BackendSurfaces> {
  const kubernetesPlugin = await import('@internal/plugin-esback-kubernetes-backend')
  kubernetesPlugin.ESBackBackendPluginIntegration(surfaces)

  return surfaces
}

const surfaces = new BackendSurfaces()
surfaces.pluginSurface.setMainApp(app)
surfaces.pluginSurface.setPlugin("catalog", catalog)
surfaces.pluginSurface.setPlugin("scaffolder", scaffolder)
surfaces.pluginSurface.setPlugin("auth", auth)
surfaces.pluginSurface.setPlugin("techdocs", techdocs)
surfaces.pluginSurface.setPlugin("proxy", proxy)
surfaces.pluginSurface.setPlugin("search", search)

// kubernetes(surfaces)

loadConfiguredPlugins(surfaces)
  .then(ctx => {
    BackendRunner(ctx)
  })