import { ReactElement } from "react"

export class SidebarItemSurface {
  private readonly _items: ReactElement[]

  public constructor() {
    this._items = []
  }

  public add(item: ReactElement) {
    this._items.push(item)
  }

  public get all(): ReactElement[] {
    return this._items
  }
}