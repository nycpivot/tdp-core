import {
  CatalogProcessor,
  EntityProvider,
} from '@backstage/plugin-catalog-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../PluginEnvironment';
import { CatalogPermissionRule } from '@backstage/plugin-catalog-backend/alpha';

export type EntityProviderBuilder = (
  env: PluginEnvironment,
) => EntityProvider[] | EntityProvider;

export type CatalogProcessorBuilder = (
  env: PluginEnvironment,
) => CatalogProcessor[] | CatalogProcessor;

export type PermissionRuleBuilder = (
  env: PluginEnvironment,
) => CatalogPermissionRule[] | CatalogPermissionRule;

export type RouterBuilder = (env: PluginEnvironment) => Promise<Router>;

export class BackendCatalogSurface {
  public static readonly id = 'BackendCatalogSurface';
  private readonly _processorBuilders: CatalogProcessorBuilder[];
  private readonly _providerBuilders: EntityProviderBuilder[];
  private readonly _permissionRules: PermissionRuleBuilder[];
  private readonly _routerBuilders: RouterBuilder[];

  constructor() {
    this._processorBuilders = [];
    this._providerBuilders = [];
    this._permissionRules = [];
    this._routerBuilders = [];
  }

  addCatalogProcessorBuilder(builder: CatalogProcessorBuilder) {
    this._processorBuilders.push(builder);
  }

  addEntityProviderBuilder(builder: EntityProviderBuilder) {
    this._providerBuilders.push(builder);
  }

  addPermissionRuleBuilder(builder: PermissionRuleBuilder) {
    this._permissionRules.push(builder);
  }

  addRouterBuilder(routerBuilder: RouterBuilder) {
    this._routerBuilders.push(routerBuilder);
  }

  buildProviders(env: PluginEnvironment): EntityProvider[] {
    return this._providerBuilders.map(b => b(env)).flat();
  }

  buildProcessors(env: PluginEnvironment): CatalogProcessor[] {
    return this._processorBuilders.map(b => b(env)).flat();
  }

  buildPermissionRules(env: PluginEnvironment): CatalogPermissionRule[] {
    return this._permissionRules.map(b => b(env)).flat();
  }

  buildRouters(env: PluginEnvironment): Promise<Router>[] {
    return this._routerBuilders.map(b => b(env));
  }
}
