import app from './plugins/app';
import auth from './plugins/auth';
import catalog from './plugins/catalog';
import proxy from './plugins/proxy';
import { BackendPluginExport, BackendSurfaces } from "@tanzu/esback-core";
import { BackendRunner } from "./BackendRunner"

export const BackendRuntime = {
  init: (plugins: BackendPluginExport[]) => {
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

    plugins.forEach(plugin => plugin(surfaces))

    surfaces.pluginSurface.addPlugin({
      name: "catalog", 
      pluginFn: catalog(surfaces),
    })
    
    BackendRunner(surfaces)
  }
}