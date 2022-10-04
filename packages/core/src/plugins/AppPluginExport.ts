import {
  ApiSurface,
  AppSurfaces,
  ComponentSurface,
  EntityPageSurface,
  PluginSurface,
  RouteSurface,
  SidebarItemSurface,
} from '../app';

export interface AppPluginExport {
  apis?: (_: ApiSurface) => void;
  components?: (_: ComponentSurface) => void;
  entityPage?: (_: EntityPageSurface) => void;
  plugins?: (_: PluginSurface) => void;
  routes?: (_: RouteSurface, ctx: AppSurfaces) => void;
  sidebarItems?: (_: SidebarItemSurface) => void;
}
