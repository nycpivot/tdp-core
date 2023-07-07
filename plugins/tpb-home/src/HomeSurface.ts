import { ReactElement } from 'react';

export class HomeSurface {
  public static readonly id = 'HomeSurface';
  private readonly _homeWidgets: ReactElement[];

  constructor() {
    this._homeWidgets = [];
  }

  public add(item: ReactElement) {
    this._homeWidgets.push(item);
  }

  public get homeWidgets(): ReactElement[] {
    return this._homeWidgets;
  }
}
