import app from './plugins/app';
import auth from './plugins/auth';
import proxy from './plugins/proxy';
import {
  BackendPluginSurface,
  EsbackPluginInterface,
  SurfaceStore,
} from '@esback/core';
import { BackendRunner } from './BackendRunner';
import { plugin as catalogBackendPlugin } from '@esback/plugin-catalog-backend';

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
        name: 'proxy',
        pluginFn: proxy,
      });
    });

    plugins.push(catalogBackendPlugin());
    plugins.forEach(plugin => plugin(this._surfaces));
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
