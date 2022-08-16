import { AppRouteBinder } from "@backstage/core-app-api"
import { ReactElement } from "react"

export class RouteSurface {
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