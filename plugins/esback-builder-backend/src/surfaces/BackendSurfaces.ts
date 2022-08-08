import { PluginSurface } from './PluginSurface'

export class BackendSurfaces {
  private readonly _pluginSurface: PluginSurface

  public constructor() {
    this._pluginSurface = new PluginSurface()
  }

  public get pluginSurface(): PluginSurface {
    return this._pluginSurface
  }
}