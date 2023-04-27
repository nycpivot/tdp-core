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
    return apiFactories.filter(factory => {
      const isDuplicate = this.isDuplicate(factory);
      if (isDuplicate) {
        // eslint-disable-next-line no-console
        console.warn(
          `An api added through a surface has a forbidden id [${factory.api.id}], it will be ignored by the app.`,
        );
      }
      return !isDuplicate;
    });
  }

  private isDuplicate(apiFactory: AnyApiFactory): boolean {
    return this._apis[apiFactory.api.id] !== undefined;
  }
}
