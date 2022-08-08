import React from 'react'
import { Route } from 'react-router'
import {
  CatalogEntityPage,
  CatalogIndexPage,
} from '@backstage/plugin-catalog';
import {
  CatalogImportPage,
} from '@backstage/plugin-catalog-import';
import { PermissionedRoute } from '@backstage/plugin-permission-react';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';
import { SidebarItem } from '@backstage/core-components'
import HomeIcon from '@material-ui/icons/Home'
import { AppSurfaces } from "@internal/plugin-app-builder"
import { AppPluginInterface } from "@internal/plugin-plugin-interface"
import { entityPage } from './components/EntityPage'

export const CatalogPlugin: AppPluginInterface = (ctx: AppSurfaces) => {
    ctx.routeSurface.add(
        <Route path="/catalog" element={<CatalogIndexPage />} />
    );

    ctx.routeSurface.add(
        <Route path="/catalog/:namespace/:kind/:name" element={<CatalogEntityPage />}>
            {entityPage}
        </Route>
    );

    ctx.routeSurface.add(
        <PermissionedRoute
            path="/catalog-import"
            permission={catalogEntityCreatePermission}
            element={<CatalogImportPage />}
        />
    )

    // ctx.routeSurface.addRouteBinder(({ bind }) => {
    //     bind(orgPlugin.externalRoutes, {
    //         catalogIndex: catalogPlugin.routes.catalogIndex,
    //     })
    // })

    ctx.sidebarItemSurface.add(
        <SidebarItem icon={HomeIcon} to="catalog" text="Home" />
    )
}
