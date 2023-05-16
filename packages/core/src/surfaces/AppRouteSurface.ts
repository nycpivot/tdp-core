import { AppRouteBinder } from '@backstage/core-app-api';
import { ReactElement } from 'react';

type RouteBinder = (context: { bind: AppRouteBinder }) => void;

export class AppRouteSurface {
  public static readonly id = 'AppRouteSurface';
  private readonly _routes: ReactElement[];
  private readonly _routeBinders: RouteBinder[];
  private _defaultRoute?: string;

  public constructor() {
    this._routeBinders = [];
    this._routes = [];
  }

  public add(route: ReactElement) {
    this._routes.push(route);
  }

  public addRouteBinder(routeBinder: RouteBinder) {
    this._routeBinders.push(routeBinder);
  }

  public setDefault(defaultRoute: string) {
    this._defaultRoute = defaultRoute;
  }

  public bindRoutes(context: { bind: AppRouteBinder }): void {
    this._routeBinders.forEach(rb => rb(context));
  }

  public get defaultRoute(): string | undefined {
    return this._defaultRoute;
  }

  public get nonDefaultRoutes(): ReactElement[] {
    return this._routes;
  }

  public get routeBinders(): RouteBinder[] {
    return this._routeBinders;
  }
}
