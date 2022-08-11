import { PluginSurface } from './PluginSurface'
import { PluginEnvironment } from "./PluginEnvironment"

export class BackendSurfaces {
  private readonly _pluginSurface: PluginSurface<PluginEnvironment>

  public constructor() {
    this._pluginSurface = new PluginSurface()
  }

  public get pluginSurface(): PluginSurface<PluginEnvironment> {
    return this._pluginSurface
  }
}