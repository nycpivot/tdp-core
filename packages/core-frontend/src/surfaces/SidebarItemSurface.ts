import { ReactElement } from 'react';

export class SidebarItemSurface {
  public static readonly id = 'SidebarItemSurface';
  private readonly _mainItems: ReactElement[];
  private readonly _topItems: ReactElement[];

  public constructor() {
    this._mainItems = [];
    this._topItems = [];
  }

  public addMainItem(item: ReactElement) {
    this._mainItems.push(item);
  }

  public addTopItem(item: ReactElement) {
    this._topItems.push(item);
  }

  public get mainItems(): ReactElement[] {
    return this._mainItems;
  }

  public get topItems(): ReactElement[] {
    return this._topItems;
  }
}
