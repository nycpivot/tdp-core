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
    surfaces.pluginSurface.addPlugin({
      name: "auth", 
      pluginFn: auth,
    })
    surfaces.pluginSurface.addPlugin({
      name: "proxy",
      pluginFn: proxy,
    })
    surfaces.pluginSurface.addPlugin({
      name: "search",
      pluginFn: search,
    })

    plugins.forEach(plugin => plugin(surfaces))

    surfaces.pluginSurface.addPlugin({
      name: "catalog", 
      pluginFn: catalog(surfaces),
    })
    BackendRunner(surfaces)
  })