import React from 'react'
import { ApiSurface } from './ApiSurface'
import { ComponentSurface } from './ComponentSurface'
import { EntityPageSurface } from './EntityPageSurface'
import { PluginSurface } from './PluginSurface'
import { RouteSurface } from './RouteSurface'
import { SidebarItemSurface } from './SidebarItemSurface'

// TODO Provide a way for plugins to register new surfaces. Customers
// might want to bring in their own plugins and register existing plugins
// into those as well
export class AppSurfaces {
  private readonly _apiSurface: ApiSurface
  private readonly _componentSurface: ComponentSurface
  private readonly _entityPageSurface: EntityPageSurface
  private readonly _pluginSurface: PluginSurface
  private readonly _routeSurface: RouteSurface
  private readonly _sidebarItemSurface: SidebarItemSurface

  public constructor() {
    this._apiSurface = new ApiSurface()
    this._componentSurface = new ComponentSurface()
    this._entityPageSurface = new EntityPageSurface()
    this._pluginSurface = new PluginSurface()
    this._routeSurface = new RouteSurface()
    this._sidebarItemSurface = new SidebarItemSurface()
  }

  public get apiSurface(): ApiSurface {
    return this._apiSurface
  }

  public get componentSurface(): ComponentSurface {
    return this._componentSurface
  }

  public get entityPageSurface(): EntityPageSurface {
    return this._entityPageSurface
  }

  public get pluginSurface(): PluginSurface {
    return this._pluginSurface
  }

  public get routeSurface(): RouteSurface {
    return this._routeSurface
  }

  public get sidebarItemSurface(): SidebarItemSurface {
    return this._sidebarItemSurface
  }
}

export const AppSurfacesContext = React.createContext(new AppSurfaces())
