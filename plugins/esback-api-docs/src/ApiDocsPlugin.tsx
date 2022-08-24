import React from 'react'
import { Route } from 'react-router'
import { AppPluginInterface } from "@esback/core"
import { ApiExplorerPage } from '@backstage/plugin-api-docs'
import ExtensionIcon from '@material-ui/icons/Extension';
import { SidebarItem } from '@backstage/core-components';

export const ApiDocsPlugin: AppPluginInterface = (ctx) => {
  ctx.routeSurface.add(
    <Route path="/api-docs" element={<ApiExplorerPage />} />
  );

  ctx.sidebarItemSurface.add(
    <SidebarItem icon={ExtensionIcon} to="api-docs" text="APIs" />
  )
}