import {
  CatalogProcessor,
  EntityProvider,
} from '@backstage/plugin-catalog-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../PluginEnvironment';

export type EntityProviderBuilder = (
  env: PluginEnvironment,
) => EntityProvider[] | EntityProvider;

export type CatalogProcessorBuilder = (
  env: PluginEnvironment,
) => CatalogProcessor[] | CatalogProcessor;

export type RouterBuilder = (env: PluginEnvironment) => Promise<Router>;

export class BackendCatalogSurface {
  private readonly _processorBuilders: CatalogProcessorBuilder[];
  private readonly _providerBuilders: EntityProviderBuilder[];
  private readonly _routerBuilders: RouterBuilder[];

  constructor() {
    this._processorBuilders = [];
    this._providerBuilders = [];
    this._routerBuilders = [];
  }

  addCatalogProcessorBuilder(builder: CatalogProcessorBuilder) {
    this._processorBuilders.push(builder);
  }

  addEntityProviderBuilder(builder: EntityProviderBuilder) {
    this._providerBuilders.push(builder);
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

  buildRouters(env: PluginEnvironment): Promise<Router>[] {
    return this._routerBuilders.map(b => b(env));
  }
}
