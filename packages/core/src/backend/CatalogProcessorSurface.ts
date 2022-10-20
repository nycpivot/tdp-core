import { CatalogProcessor } from '@backstage/plugin-catalog-backend';

export class CatalogProcessorSurface {
  private readonly _processors: CatalogProcessor[];

  constructor() {
    this._processors = [];
  }

  public addCatalogProcessor(processor: CatalogProcessor) {
    this._processors.push(processor);
  }

  public get processors(): CatalogProcessor[] {
    return this._processors;
  }
}
