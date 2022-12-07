import { ReactElement } from 'react';

export class SidebarItemSurface {
  private readonly _items: ReactElement[];
  private readonly _topItems: ReactElement[];

  public constructor() {
    this._items = [];
    this._topItems = [];
  }

  public add(item: ReactElement) {
    this._items.push(item);
  }

  public addTopItem(item: ReactElement) {
    this._topItems.push(item);
  }

  public get all(): ReactElement[] {
    return this._items;
  }

  public get topItems(): ReactElement[] {
    return this._topItems;
  }
}
