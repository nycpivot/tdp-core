import { BackstagePlugin } from '@backstage/core-plugin-api';

export class PluginSurface {
  private readonly _plugins: BackstagePlugin[];

  public constructor() {
    this._plugins = [];
  }

  public add(plugin: BackstagePlugin) {
    this._plugins.push(plugin);
  }

  public get plugins(): BackstagePlugin[] {
    return this._plugins;
  }
}
