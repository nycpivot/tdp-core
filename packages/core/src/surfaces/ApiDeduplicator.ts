import {
  AnyApiFactory,
  ApiRef,
  appThemeApiRef,
  configApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';

type ApiMap = {
  [id: string]: ApiRef<any>;
};

const apis = [
  // the following apis are registered in [this file](https://github.com/backstage/backstage/blob/8ee31f38bfb2fd7c416fb8da9472fd46f0a7e664/packages/core-app-api/src/app/AppManager.tsx#L428) -> no way found to get them before creating our app
  // note that we don't include the featureFlagsApiRef because it can be replaced
  // we also don't include the backstage default apis here for the same reason TBC
  // (those that are listed [here](https://github.com/backstage/backstage/blob/master/packages/app-defaults/src/defaults/apis.ts)) TBC
  appThemeApiRef,
  configApiRef,
  identityApiRef,
];

export class ApiDeduplicator {
  private _apis: ApiMap = {};

  constructor() {
    apis.forEach(f => {
      this._apis[f.id] = f;
    });
  }

  ignoreDuplicates(apiFactories: AnyApiFactory[]): AnyApiFactory[] {
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
