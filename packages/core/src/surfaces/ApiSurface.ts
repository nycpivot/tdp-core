import { AnyApiFactory } from '@backstage/core-plugin-api';

type ApiFactoryMap = {
  [id: string]: AnyApiFactory;
};

export class ApiSurface {
  private static _apisToIgnore: string[] = [];
  public static readonly id = 'ApiSurface';
  private readonly _apis: ApiFactoryMap = {};

  static set apisToIgnore(apisToIgnore: string[]) {
    ApiSurface._apisToIgnore = apisToIgnore;
  }

  public add(factory: AnyApiFactory) {
    if (this._apis[factory.api.id]) {
      // eslint-disable-next-line no-console
      console.warn(
        `An api with the same id [${factory.api.id}] already exists in the api surface: only the last one will be kept.`,
      );
    }
    if (!ApiSurface._apisToIgnore.includes(factory.api.id)) {
      this._apis[factory.api.id] = factory;
    } else {
      // eslint-disable-next-line no-console
      console.warn(
        `An api has a forbidden id [${factory.api.id}], it will be ignored by the app.`,
      );
    }
  }

  public get apis(): AnyApiFactory[] {
    return Object.values(this._apis);
  }
}
