import { AnyApiFactory } from '@backstage/core-plugin-api';

export class ApiSurface {
  private readonly _apis: AnyApiFactory[] = [];

  public add(api: AnyApiFactory) {
    this._apis.push(api);
  }

  public get apis(): AnyApiFactory[] {
    return this._apis;
  }
}
