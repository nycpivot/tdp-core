import { Router } from "express"

type PluginFn<T> = (env: T) => Promise<Router>

interface Plugin<T> {
  name: string
  path?: string
  pluginFn: PluginFn<T>
}

export class PluginSurface<T> {
  private readonly _plugins: Array<Plugin<T>>
  private _mainApp?: PluginFn<T>

  constructor() {
    this._plugins = []
  }

  public setMainApp(fn: PluginFn<T>) {
    this._mainApp = fn
  }

  public addPlugin(plugin: Plugin<T>) {
    const cleanPlugin: Plugin<T> = {
      ...plugin,
      path: plugin.path?.replace(/^\/+/, '')
    }

    if (!this._plugins.find((p) => p.name === cleanPlugin.name && p.path === cleanPlugin.path)) {
      this._plugins.push(cleanPlugin)
    }
  }

  public get mainApp(): PluginFn<T> | undefined {
    return this._mainApp
  }

  public get plugins(): Array<Plugin<T>> {
    return this._plugins
  } 
}