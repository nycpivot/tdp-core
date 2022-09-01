import { Router } from "express"

type PluginFn<T> = (env: T) => Promise<Router>

interface Plugin<T> {
    name: string
    path?: string
    pluginFn: PluginFn<T>
}

export class PluginSurface<T> {
    private readonly _plugins: Set<Plugin<T>>
    private _mainApp?: PluginFn<T>

    constructor() {
        this._plugins = new Set()
    }

    public setMainApp(fn: PluginFn<T>) {
        this._mainApp = fn
    }

    public addPlugin(plugin: Plugin<T>) {
        this._plugins.add(plugin)
    }

    public get mainApp(): PluginFn<T> | undefined {
        return this._mainApp
    }

    public get plugins(): Set<Plugin<T>> {
        return this._plugins
    } 
}