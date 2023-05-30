import type { TpbPluginInterface } from '@tpb/core-common';

export interface RoutableConfig {
  path?: string;
  label?: string;
}

export type AppPluginInterface<T = {}> = (config?: T) => TpbPluginInterface;

interface BackendPluginConfig {
  name?: string;
  path?: string;
}

export type BackendPluginInterface<T = {}> = (
  config?: T & BackendPluginConfig,
) => TpbPluginInterface;
