import { AnyApiFactory } from '@backstage/core-plugin-api';

type ApiFactoryMap = {
  [id: string]: AnyApiFactory;
};

export class ApiSurface {
  private readonly _apis: ApiFactoryMap = {};
  public static readonly id = 'ApiSurface';

  public add(factory: AnyApiFactory) {
    this._apis[factory.api.id] = factory;
  }

  public get apis(): AnyApiFactory[] {
    return Object.values(this._apis);
  }
}
