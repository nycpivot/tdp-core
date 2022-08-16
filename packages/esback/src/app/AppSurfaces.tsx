import React from 'react'
import { EntityPageSurface } from './EntityPageSurface'
import { RouteSurface } from './RouteSurface'
import { SidebarItemSurface } from './SidebarItemSurface'

export class AppSurfaces {
  private readonly _entityPageSurface: EntityPageSurface
  private readonly _routeSurface: RouteSurface
  private readonly _sidebarItemSurface: SidebarItemSurface

  public constructor() {
    this._entityPageSurface = new EntityPageSurface()
    this._routeSurface = new RouteSurface()
    this._sidebarItemSurface = new SidebarItemSurface()
  }

  public get entityPageSurface(): EntityPageSurface {
    return this._entityPageSurface
  }

  public get routeSurface(): RouteSurface {
    return this._routeSurface
  }

  public get sidebarItemSurface(): SidebarItemSurface {
    return this._sidebarItemSurface
  }
}

export const AppSurfacesContext = React.createContext(new AppSurfaces())
