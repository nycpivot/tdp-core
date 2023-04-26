import { AnyApiFactory } from '@backstage/core-plugin-api';

type ApiFactoryMap = {
  [id: string]: AnyApiFactory;
};

export class ApiDuplicatesFinder {
  private _factories: ApiFactoryMap = {};

  constructor(factories: AnyApiFactory[]) {
    factories.forEach(f => {
      this._factories[f.api.id] = f;
    });
  }

  isDuplicate(apiFactory: AnyApiFactory): boolean {
    return this._factories[apiFactory.api.id] !== undefined;
  }
}
