import React from 'react'
import { Route } from 'react-router'
import {
  CatalogEntityPage,
  CatalogIndexPage,
} from '@backstage/plugin-catalog';
import { SidebarItem } from '@backstage/core-components'
import HomeIcon from '@material-ui/icons/Home'
import { AppSurfaces } from "@internal/plugin-app-builder/src/core/AppSurfaces"
import { entityPage } from './components/EntityPage'

export const CatalogPlugin = (ctx: AppSurfaces) => {
    ctx.routeSurface.add(
        <Route path="/catalog" element={<CatalogIndexPage />} />
    );

    ctx.routeSurface.add(
        <Route path="/catalog/:namespace/:kind/:name" element={<CatalogEntityPage />}>
            {entityPage}
        </Route>
    );

    // ctx.routeSurface.addRouteBinder(({ bind }) => {
    //     bind(orgPlugin.externalRoutes, {
    //         catalogIndex: catalogPlugin.routes.catalogIndex,
    //     })
    // })

    ctx.sidebarItemSurface.add(
        <SidebarItem icon={HomeIcon} to="catalog" text="Home" />
    )
}
