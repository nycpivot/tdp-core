import { AnyApiFactory, ApiRef } from '@backstage/core-plugin-api';

type ApiMap = {
  [id: string]: ApiRef<any>;
};

export class ApiDuplicatesFinder {
  private _apis: ApiMap = {};

  constructor(apis: ApiRef<any>[]) {
    apis.forEach(f => {
      this._apis[f.id] = f;
    });
  }

  isDuplicate(apiFactory: AnyApiFactory): boolean {
    return this._apis[apiFactory.api.id] !== undefined;
  }
}
