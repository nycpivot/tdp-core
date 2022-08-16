import { Router } from "express"

type PluginFn<T> = (env: T) => Promise<Router>

export class PluginSurface<T> {
    private readonly _plugins: Map<string, PluginFn<T>>
    private _mainApp?: PluginFn<T>

    constructor() {
        this._plugins = new Map()
    }

    public setMainApp(fn: PluginFn<T>) {
        this._mainApp = fn
    }

    public setPlugin(name: string, plugin: PluginFn<T>) {
        this._plugins.set(name, plugin)
    }

    public get mainApp(): PluginFn<T> | undefined {
        return this._mainApp
    }

    public get plugins(): Map<string, PluginFn<T>> {
        return this._plugins
    } 
}