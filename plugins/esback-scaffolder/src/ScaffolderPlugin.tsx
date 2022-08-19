import React from 'react'
import { AppPluginInterface } from "@esback/core"
import { Route } from 'react-router';
import { ScaffolderPage, scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { catalogPlugin } from '@backstage/plugin-catalog';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import { SidebarItem } from '@backstage/core-components';

export const ScaffolderPlugin: AppPluginInterface = (ctx) => {
  ctx.routeSurface.add(
    <Route path="/create" element={<ScaffolderPage />} />
  )

  ctx.routeSurface.addRouteBinder(({ bind }) => {
    bind(catalogPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
    });
  })

  ctx.sidebarItemSurface.add(
    <SidebarItem icon={CreateComponentIcon} to="create" text="Create..." />
  )
}