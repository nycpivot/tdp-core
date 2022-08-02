import { AppRouteBinder } from "@backstage/core-app-api"
import { ReactElement } from "react"

export class AppRouteSurface {
  private readonly _routes: ReactElement[]
  private readonly _routeBinders: ((context: { bind: AppRouteBinder }) => void)[]
  private _defaultRoute?: string

  public constructor() {
    this._routeBinders = []
    this._routes = []
  }

  public add(route: ReactElement) {
    this._routes.push(route)
  }

  public addRouteBinder(routeBinder: (context: { bind: AppRouteBinder }) => void) {
    this._routeBinders.push(routeBinder)
  }

  public setDefault(defaultRoute: string) {
    this._defaultRoute = defaultRoute
  }

  public bindRoutes(context: { bind: AppRouteBinder }): void {
    this._routeBinders.forEach(rb => rb(context))
  }

  public get defaultRoute(): string | undefined {
    return this._defaultRoute
  }

  public get nonDefaultRoutes(): ReactElement[] {
    return this._routes
  }
}

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


export class AppSurfaces {
  private readonly _routeSurface: AppRouteSurface
  private readonly _sidebarItemSurface: SidebarItemSurface

  public constructor() {
    this._routeSurface = new AppRouteSurface()
    this._sidebarItemSurface = new SidebarItemSurface()
  }

  public get routeSurface(): AppRouteSurface {
    return this._routeSurface
  }

  public get sidebarItemSurface(): SidebarItemSurface {
    return this._sidebarItemSurface
  }
}
