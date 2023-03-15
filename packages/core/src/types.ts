import { SurfaceStoreInterface } from './api';

export interface RoutableConfig {
  path?: string;
  label?: string;
}

export type EsbackPluginInterface = (context: SurfaceStoreInterface) => void;

export type AppPluginInterface<T = {}> = (config?: T) => EsbackPluginInterface;

interface BackendPluginConfig {
  name?: string;
  path?: string;
}

export type BackendPluginInterface<T = {}> = (
  config?: T & BackendPluginConfig,
) => EsbackPluginInterface;
