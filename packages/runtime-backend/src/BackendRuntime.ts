import app from './plugins/app';
import proxy from './plugins/proxy';
import {
  BackendPluginSurface,
  EsbackPluginInterface,
  SurfaceStoreInterface,
  SurfaceStore,
} from '@tpb/core';
import { BackendRunner } from './BackendRunner';
import { plugin as catalogBackendPlugin } from '@tpb/plugin-catalog-backend';
import { plugin as techdocsBackendPlugin } from '@tpb/plugin-techdocs-backend';
import { plugin as searchBackendPlugin } from '@tpb/plugin-search-backend';
import { plugin as authBackendPlugin } from '@tpb/plugin-auth-backend';

export class BackendRuntime {
  private readonly _surfaces: SurfaceStoreInterface;

  constructor(plugins: EsbackPluginInterface[] = []) {
    this._surfaces = new SurfaceStore();

    catalogBackendPlugin()(this._surfaces);
    techdocsBackendPlugin()(this._surfaces);
    searchBackendPlugin()(this._surfaces);
    authBackendPlugin()(this._surfaces);

    this._surfaces.applyTo(BackendPluginSurface, pluginSurface => {
      pluginSurface.setMainApp(app);

      pluginSurface.addPlugin({
        name: 'proxy',
        pluginFn: proxy,
      });
    });

    plugins.forEach(plugin => plugin(this._surfaces));
  }

  public start() {
    module.hot?.accept();

    BackendRunner(this._surfaces).catch(error => {
      console.error(`Backend failed to start up, ${error}`);
      process.exit(1);
    });
  }

  public get surfaces(): SurfaceStoreInterface {
    return this._surfaces;
  }
}
