import React from 'react'
import { Route } from 'react-router'
import {
  CatalogEntityPage,
  CatalogIndexPage,
  catalogPlugin
} from '@backstage/plugin-catalog';
import {
  CatalogImportPage, catalogImportPlugin,
} from '@backstage/plugin-catalog-import';
import { PermissionedRoute } from '@backstage/plugin-permission-react';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';
import { SidebarItem } from '@backstage/core-components'
import { orgPlugin } from '@backstage/plugin-org'
import HomeIcon from '@material-ui/icons/Home'
import { AppPluginInterface } from "@esback/core"
import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';
import { entityPage } from './components/EntityPage'
import { apiDocsPlugin } from '@backstage/plugin-api-docs';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';

export const CatalogPlugin: AppPluginInterface = () => {
  return {
    routes: (routeSurface, ctx) => {
      routeSurface.add(
        <Route path="/catalog" element={<CatalogIndexPage />} />
      )

      routeSurface.add(
        <Route path="/catalog/:namespace/:kind/:name" element={<CatalogEntityPage />}>
          {entityPage(ctx.entityPageSurface)}
        </Route>
      )

      routeSurface.add(
        <PermissionedRoute
          path="/catalog-import"
          permission={catalogEntityCreatePermission}
          element={<CatalogImportPage />}
        />
      )

      routeSurface.add(
        <Route path="/catalog-graph" element={<CatalogGraphPage />} />
      )

      routeSurface.addRouteBinder(({ bind }) => {
        bind(orgPlugin.externalRoutes, {
          catalogIndex: catalogPlugin.routes.catalogIndex,
        })
      })

      routeSurface.addRouteBinder(({ bind }) => {
        bind(apiDocsPlugin.externalRoutes, {
          registerApi: catalogImportPlugin.routes.importPage,
        })
      })

      routeSurface.addRouteBinder(({ bind }) => {
        bind(scaffolderPlugin.externalRoutes, {
          registerComponent: catalogImportPlugin.routes.importPage,
        })
      })
    },
    sidebarItems: (sidebarItemSurface) => {
      sidebarItemSurface.add(
        <SidebarItem icon={HomeIcon} to="catalog" text="Home" />
      )
    }
  }
}