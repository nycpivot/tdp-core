import type { TpbPluginInterface } from '@tpb/core-common';

interface BackendPluginConfig {
  name?: string;
  path?: string;
}

export type BackendPluginInterface<T = {}> = (
  config?: T & BackendPluginConfig,
) => TpbPluginInterface;
