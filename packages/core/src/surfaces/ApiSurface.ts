import { AnyApiFactory } from '@backstage/core-plugin-api';
import { ApiDeduplicator } from './ApiDeduplicator';

type ApiFactoryMap = {
  [id: string]: AnyApiFactory;
};

export class ApiSurface {
  public static readonly id = 'ApiSurface';
  private readonly _apis: ApiFactoryMap = {};
  private readonly _deduplicator = new ApiDeduplicator();

  public add(factory: AnyApiFactory) {
    if (this._apis[factory.api.id]) {
      // eslint-disable-next-line no-console
      console.warn(
        `An api with the same id [${factory.api.id}] already exists in the api surface: only the last one will be kept.`,
      );
    }
    this._apis[factory.api.id] = factory;
  }

  public get apis(): AnyApiFactory[] {
    return this._deduplicator.ignoreDuplicates(Object.values(this._apis));
  }
}
