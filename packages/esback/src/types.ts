import { BackendSurfaces } from "./backend";
import { AppPluginExport } from "./plugins";


export type AppPluginInterface<T= {}> = (config?: T) => AppPluginExport
export type BackendPluginInterface = (context: BackendSurfaces) => void