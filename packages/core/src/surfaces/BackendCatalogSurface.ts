import {
  CatalogProcessor,
  EntityProvider,
} from '@backstage/plugin-catalog-backend';
import { PluginEnvironment } from '../PluginEnvironment';

export type EntityProviderBuilder = (
  env: PluginEnvironment,
) => EntityProvider[];

export type CatalogProcessorBuilder = (
  env: PluginEnvironment,
) => CatalogProcessor[];

export class BackendCatalogSurface {
  private readonly _processorBuilders: CatalogProcessorBuilder[];
  private readonly _providerBuilders: EntityProviderBuilder[];

  constructor() {
    this._processorBuilders = [];
    this._providerBuilders = [];
  }

  // TODO Kept for backwards compatibility but might be deprecated if a
  // big proportion of catalog processors need the plugin environment to
  // be created.
  public addCatalogProcessor(processor: CatalogProcessor) {
    this.addCatalogProcessorBuilder(() => [processor]);
  }

  // TODO Kept for backwards compatibility but might be deprecated if a
  // big proportion of entity providers need the plugin environment to
  // be created.
  public addEntityProvider(provider: EntityProvider) {
    this.addEntityProviderBuilder(() => [provider]);
  }

  addCatalogProcessorBuilder(builder: CatalogProcessorBuilder) {
    this._processorBuilders.push(builder);
  }

  addEntityProviderBuilder(builder: EntityProviderBuilder) {
    this._providerBuilders.push(builder);
  }

  buildProviders(env: PluginEnvironment): EntityProvider[] {
    return this._providerBuilders.map(b => b(env)).flat();
  }

  buildProcessors(env: PluginEnvironment) {
    return this._processorBuilders.map(b => b(env)).flat();
  }
}
