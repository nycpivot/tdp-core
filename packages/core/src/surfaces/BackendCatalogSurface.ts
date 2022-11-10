import {
  CatalogProcessor,
  EntityProvider,
} from '@backstage/plugin-catalog-backend';
import {PluginEnvironment} from "../PluginEnvironment";

type EntityProviderBuilder = (env: PluginEnvironment) => EntityProvider[];

export class BackendCatalogSurface {
  private readonly _processors: CatalogProcessor[];
  private readonly _providers: EntityProvider[];
  private readonly _providerBuilders: EntityProviderBuilder[];

  constructor() {
    this._processors = [];
    this._providers = [];
    this._providerBuilders = [];
  }

  public addCatalogProcessor(processor: CatalogProcessor) {
    this._processors.push(processor);
  }

  public addEntityProvider(provider: EntityProvider) {
    this._providers.push(provider);
  }

  public get processors(): CatalogProcessor[] {
    return this._processors;
  }

  public get providers(): EntityProvider[] {
    return this._providers;
  }

  addEntityProviderBuilder(builder: EntityProviderBuilder) {
    this._providerBuilders.push(builder);
  }

  buildProviders(env: PluginEnvironment): EntityProvider[] {
    return this._providerBuilders.map(b => b(env)).flat()
  }
}
