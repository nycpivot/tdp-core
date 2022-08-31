import { BackendSurfaces } from "./backend";
import { AppPluginExport } from "./plugins";


export type AppPluginInterface<T= {}> = (config?: T) => AppPluginExport

export type BackendPluginExport = (context: BackendSurfaces) => void
export type BackendPluginInterface<T= {}> = (config?: T) => BackendPluginExport