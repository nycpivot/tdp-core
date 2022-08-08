import { PluginEnvironment } from '../types';
import { Router } from "express"

type PluginFn = (env: PluginEnvironment) => Promise<Router>

export class PluginSurface {
    private readonly _plugins: Map<string, PluginFn>
    private _mainApp?: PluginFn

    constructor() {
        this._plugins = new Map()
    }

    public setMainApp(fn: PluginFn) {
        this._mainApp = fn
    }

    public setPlugin(name: string, plugin: PluginFn) {
        this._plugins.set(name, plugin)
    }

    public get mainApp(): PluginFn | undefined {
        return this._mainApp
    }

    public get plugins(): Map<string, PluginFn> {
        return this._plugins
    } 
}