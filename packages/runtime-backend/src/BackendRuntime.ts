import app from './plugins/app';
import auth from './plugins/auth';
import catalog from './plugins/catalog';
import proxy from './plugins/proxy';
import { BackendPluginExport, BackendSurfaces } from '@esback/core';
import { BackendRunner } from './BackendRunner';

export class BackendRuntime {
  private readonly _surfaces = new BackendSurfaces();

  constructor(plugins: BackendPluginExport[] = []) {
    this._surfaces.pluginSurface.setMainApp(app);
    this._surfaces.pluginSurface.addPlugin({
      name: 'auth',
      pluginFn: auth,
    });
    this._surfaces.pluginSurface.addPlugin({
      name: 'proxy',
      pluginFn: proxy,
    });

    plugins.forEach(plugin => plugin(this._surfaces));

    this._surfaces.pluginSurface.addPlugin({
      name: 'catalog',
      pluginFn: catalog(this._surfaces),
    });
  }

  public start() {
    module.hot?.accept();

    BackendRunner(this._surfaces).catch(error => {
      console.error(`Backend failed to start up, ${error}`);
      process.exit(1);
    });
  }

  public get surfaces(): BackendSurfaces {
    return this._surfaces;
  }
}
