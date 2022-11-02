import app from './plugins/app';
import auth from './plugins/auth';
import catalog from './plugins/catalog';
import proxy from './plugins/proxy';
import {
  BackendPluginSurface,
  EsbackPluginInterface,
  SurfaceStore,
} from '@esback/core';
import { BackendRunner } from './BackendRunner';

export class BackendRuntime {
  private readonly _surfaces: SurfaceStore;

  constructor(plugins: EsbackPluginInterface[] = []) {
    this._surfaces = new SurfaceStore();

    this._surfaces.applyTo(BackendPluginSurface, pluginSurface => {
      pluginSurface.setMainApp(app);
      pluginSurface.addPlugin({
        name: 'auth',
        pluginFn: auth,
      });

      pluginSurface.addPlugin({
        name: 'auth',
        pluginFn: auth,
      });
      pluginSurface.addPlugin({
        name: 'proxy',
        pluginFn: proxy,
      });

      plugins.forEach(plugin => plugin(this._surfaces));

      pluginSurface.addPlugin({
        name: 'catalog',
        pluginFn: catalog(this._surfaces),
      });
    });
  }

  public start() {
    module.hot?.accept();

    BackendRunner(this._surfaces).catch(error => {
      console.error(`Backend failed to start up, ${error}`);
      process.exit(1);
    });
  }

  public get surfaces(): SurfaceStore {
    return this._surfaces;
  }
}
