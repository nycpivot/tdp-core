import {
  AnyApiFactory,
  appThemeApiRef,
  configApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';

type ApiFactoryMap = {
  [id: string]: AnyApiFactory;
};

const apisToIgnore = [
  // the following apis are registered in [this file](https://github.com/backstage/backstage/blob/8ee31f38bfb2fd7c416fb8da9472fd46f0a7e664/packages/core-app-api/src/app/AppManager.tsx#L428) -> no way found to get them before creating our app
  // note that we don't include the featureFlagsApiRef because it can be replaced
  // we also don't include the backstage default apis here for the same reason TBC
  // (those that are listed [here](https://github.com/backstage/backstage/blob/master/packages/app-defaults/src/defaults/apis.ts)) TBC
  appThemeApiRef.id,
  configApiRef.id,
  identityApiRef.id,
];

export class ApiSurface {
  public static readonly id = 'ApiSurface';
  private readonly _apis: ApiFactoryMap = {};

  public add(factory: AnyApiFactory) {
    if (this._apis[factory.api.id]) {
      // eslint-disable-next-line no-console
      console.warn(
        `An api with the same id [${factory.api.id}] already exists in the api surface: only the last one will be kept.`,
      );
    }
    if (!apisToIgnore.includes(factory.api.id)) {
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
