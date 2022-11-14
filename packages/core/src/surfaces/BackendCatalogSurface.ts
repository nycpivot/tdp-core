import {
  CatalogProcessor,
  EntityProvider,
} from '@backstage/plugin-catalog-backend';
import { PluginEnvironment } from '../PluginEnvironment';

export type EntityProviderBuilder = (
  env: PluginEnvironment,
) => EntityProvider[];

export class BackendCatalogSurface {
  private readonly _processors: CatalogProcessor[];
  private readonly _providerBuilders: EntityProviderBuilder[];

  constructor() {
    this._processors = [];
    this._providerBuilders = [];
  }

  public addCatalogProcessor(processor: CatalogProcessor) {
    this._processors.push(processor);
  }

  // TODO Kept for backwards compatibility but might be deprecated if a
  // big proportion of entity providers need the plugin environment to
  // be created.
  public addEntityProvider(provider: EntityProvider) {
    this.addEntityProviderBuilder(() => [provider]);
  }

  public get processors(): CatalogProcessor[] {
    return this._processors;
  }

  addEntityProviderBuilder(builder: EntityProviderBuilder) {
    this._providerBuilders.push(builder);
  }

  buildProviders(env: PluginEnvironment): EntityProvider[] {
    return this._providerBuilders.map(b => b(env)).flat();
  }
}
