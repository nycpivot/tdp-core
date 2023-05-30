import { Router } from 'express';
import { PluginEnvironment } from '../PluginEnvironment';

type PluginFn = (env: PluginEnvironment) => Promise<Router>;

interface Plugin {
  name: string;
  path?: string;
  pluginFn: PluginFn;
}

export class BackendPluginSurface {
  public static readonly id = 'BackendPluginSurface';
  private readonly _plugins: Array<Plugin>;
  private _mainApp?: PluginFn;

  constructor() {
    this._plugins = [];
  }

  public setMainApp(fn: PluginFn) {
    this._mainApp = fn;
  }

  public addPlugin(plugin: Plugin) {
    const cleanPlugin: Plugin = {
      ...plugin,
      path: plugin.path?.replace(/^\/+/, ''),
    };

    if (
      !this._plugins.find(
        p => p.name === cleanPlugin.name && p.path === cleanPlugin.path,
      )
    ) {
      this._plugins.push(cleanPlugin);
    }
  }

  public get mainApp(): PluginFn | undefined {
    return this._mainApp;
  }

  public get plugins(): Array<Plugin> {
    return this._plugins;
  }
}
