import { AppComponents } from '@backstage/core-app-api';

export class AppComponentSurface {
  private readonly _components: Partial<AppComponents>;

  public constructor() {
    this._components = {};
  }

  public add<K extends keyof AppComponents>(
    key: K,
    component: AppComponents[K],
  ) {
    this._components[key] = component;
  }

  public get components(): Partial<AppComponents> {
    return this._components;
  }
}
