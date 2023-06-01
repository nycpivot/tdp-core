import {
  BackendCatalogSurface,
  BackendPluginInterface,
  BackendPluginSurface,
  PluginEnvironment,
} from '@tpb/core-backend';
import { Router } from 'express';
import { createRouter } from '@backstage/plugin-permission-backend';
import { catalogAnnotationContainsRule } from './CatalogAnnotationContainsRule';
import { PermissionPolicySurface } from './PermissionPolicySurface';

const createPlugin = (permissionPolicySurface: PermissionPolicySurface) => {
  return async (env: PluginEnvironment): Promise<Router> => {
    return await createRouter({
      config: env.config,
      logger: env.logger,
      discovery: env.discovery,
      policy: permissionPolicySurface.getPermissionPolicy(env.config),
      identity: env.identity,
    });
  };
};

export const PermissionBackendPlugin: BackendPluginInterface =
  () => surfaces => {
    surfaces.applyTo(BackendCatalogSurface, surface => {
      surface.addPermissionRuleBuilder(() => catalogAnnotationContainsRule);
    });
    surfaces.applyWithDependency(
      BackendPluginSurface,
      PermissionPolicySurface,
      (backendPluginSurface, permissionPolicySurface) => {
        backendPluginSurface.addPlugin({
          name: 'permission',
          pluginFn: createPlugin(permissionPolicySurface),
        });
      },
    );
  };
