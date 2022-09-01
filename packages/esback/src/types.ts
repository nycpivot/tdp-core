import { BackendSurfaces } from "./backend";
import { AppPluginExport } from "./plugins";

export interface RoutableConfig {
  path?: string
  label?: string
}

export type AppPluginInterface<T= {}> = (config?: T) => AppPluginExport

interface BackendPluginConfig {
  name?: string
  path?: string
}

export type BackendPluginExport = (context: BackendSurfaces) => void
export type BackendPluginInterface<T= {}> = (config?: T & BackendPluginConfig) => BackendPluginExport