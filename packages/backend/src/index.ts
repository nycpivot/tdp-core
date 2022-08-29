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
import { BackendPluginInterface, BackendSurfaces } from "@esback/core";
import { BackendRunner } from "./core/BackendRunner"

async function loadConfiguredPlugins(surfaces: BackendSurfaces): Promise<BackendSurfaces> {
  const plugins: BackendPluginInterface[] = [
    // {{esback:plugin:imports}}
  ]

  plugins.forEach(plugin => plugin(surfaces))

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