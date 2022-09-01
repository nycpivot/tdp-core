import React from 'react'
import { AppPluginInterface, RoutableConfig } from "@esback/core"
import { Route } from 'react-router';
import { ScaffolderPage, scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { catalogPlugin } from '@backstage/plugin-catalog';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import { SidebarItem } from '@backstage/core-components';

export const ScaffolderPlugin: AppPluginInterface<RoutableConfig> = (config) => ({
  routes: (surface) => {
    surface.add(<Route path={`/${config?.path || "create"}`} element={<ScaffolderPage />} />)

    surface.addRouteBinder(({ bind }) => {
      bind(catalogPlugin.externalRoutes, {
        createComponent: scaffolderPlugin.routes.root,
      });
    })
  },
  sidebarItems: (surface) => surface.add(
    <SidebarItem icon={CreateComponentIcon} to={config?.path || "create"} text={config?.label || "Create..."} />
  )
})