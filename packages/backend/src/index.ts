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
import { BackendRunner, esbackPlugins } from "./core"

esbackPlugins()
  .then(plugins => {
    const surfaces = new BackendSurfaces()

    surfaces.pluginSurface.setMainApp(app)
    surfaces.pluginSurface.setPlugin("auth", auth)
    surfaces.pluginSurface.setPlugin("proxy", proxy)
    surfaces.pluginSurface.setPlugin("search", search)

    plugins.forEach(plugin => plugin(surfaces))

    surfaces.pluginSurface.setPlugin("catalog", catalog(surfaces))
    BackendRunner(surfaces)
  })