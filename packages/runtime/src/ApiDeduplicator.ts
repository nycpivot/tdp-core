import { AnyApiFactory, ApiRef } from '@backstage/core-plugin-api';

type ApiMap = {
  [id: string]: ApiRef<any>;
};

export class ApiDeduplicator {
  private _apis: ApiMap = {};

  constructor(apis: ApiRef<any>[]) {
    apis.forEach(f => {
      this._apis[f.id] = f;
    });
  }

  deduplicate(apiFactories: AnyApiFactory[]): AnyApiFactory[] {
    return apiFactories.filter(factory => !this.isDuplicate(factory));
  }

  private isDuplicate(apiFactory: AnyApiFactory): boolean {
    return this._apis[apiFactory.api.id] !== undefined;
  }
}
