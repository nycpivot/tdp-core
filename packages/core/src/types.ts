import type { TpbPluginInterface } from '@tpb/core-common';

export interface RoutableConfig {
  path?: string;
  label?: string;
}

export type AppPluginInterface<T = {}> = (config?: T) => TpbPluginInterface;
