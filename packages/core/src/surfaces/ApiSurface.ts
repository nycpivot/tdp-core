import { AnyApiFactory } from '@backstage/core-plugin-api';

type ApiFactoryMap = {
  [id: string]: AnyApiFactory;
};

export class ApiSurface {
  private readonly _apis: ApiFactoryMap = {};
  public static readonly id = 'ApiSurface';

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
    return Object.values(this._apis);
  }
}
