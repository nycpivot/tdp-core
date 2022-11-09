import {
  CatalogProcessor,
  EntityProvider,
} from '@backstage/plugin-catalog-backend';

export class BackendCatalogSurface {
  private readonly _processors: CatalogProcessor[];
  private readonly _providers: EntityProvider[];

  constructor() {
    this._processors = [];
    this._providers = [];
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
}
