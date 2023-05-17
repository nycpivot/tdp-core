import {
  BackendPluginInterface,
  BackendPluginSurface,
  PluginEnvironment,
} from '@tpb/core';
import { Router } from 'express';
import { createRouter } from '@backstage/plugin-user-settings-backend';

const createPlugin = () => {
  return async (env: PluginEnvironment): Promise<Router> => {
    return await createRouter({
      database: env.database,
      identity: env.identity,
    });
  };
};

export const BackstageUserSettingsBackendPlugin: BackendPluginInterface =
  () => surfaces =>
    surfaces.applyTo(BackendPluginSurface, surface => {
      surface.addPlugin({
        name: 'user-settings',
        pluginFn: createPlugin(),
      });
    });
