import React from 'react';
import { Route } from 'react-router';
import {
  CatalogEntityPage,
  CatalogIndexPage,
  catalogPlugin,
} from '@backstage/plugin-catalog';
import {
  CatalogImportPage,
  catalogImportPlugin,
} from '@backstage/plugin-catalog-import';
import { PermissionedRoute } from '@backstage/plugin-permission-react';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';
import { SidebarItem } from '@backstage/core-components';
import { orgPlugin } from '@backstage/plugin-org';
import HomeIcon from '@material-ui/icons/Home';
import {
  AppPluginInterface,
  AppRouteSurface,
  RoutableConfig,
  SidebarItemSurface,
} from '@esback/core';
import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';
import { entityPage } from './components/EntityPage';
import { apiDocsPlugin } from '@backstage/plugin-api-docs';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { EntityPageSurface } from './EntityPageSurface';

interface CatalogConfig {
  disableImport?: boolean;
  disableGraph?: boolean;
}

export const CatalogPlugin: AppPluginInterface<
  RoutableConfig & CatalogConfig
> = config => {
  const { label, path } = {
    label: 'Home',
    path: 'catalog',
    ...config,
  };

  return context => {
    context.applyTo(AppRouteSurface, routes => {
      routes.add(<Route path={`/${path}`} element={<CatalogIndexPage />} />);

      routes.addRouteBinder(({ bind }) => {
        bind(orgPlugin.externalRoutes, {
          catalogIndex: catalogPlugin.routes.catalogIndex,
        });
      });

      if (!config?.disableImport) {
        routes.add(
          <PermissionedRoute
            path="/catalog-import"
            permission={catalogEntityCreatePermission}
            element={<CatalogImportPage />}
          />,
        );

        routes.addRouteBinder(({ bind }) => {
          bind(apiDocsPlugin.externalRoutes, {
            registerApi: catalogImportPlugin.routes.importPage,
          });
        });

        routes.addRouteBinder(({ bind }) => {
          bind(scaffolderPlugin.externalRoutes, {
            registerComponent: catalogImportPlugin.routes.importPage,
          });
        });
      }

      if (!config?.disableGraph) {
        routes.add(
          <Route path="/catalog-graph" element={<CatalogGraphPage />} />,
        );
      }
    });

    context.applyWithDeps(
      AppRouteSurface,
      EntityPageSurface,
      (routes, entityPageSurface) =>
        routes.add(
          <Route
            path={`/${path}/:namespace/:kind/:name`}
            element={<CatalogEntityPage />}
          >
            {entityPage(entityPageSurface)}
          </Route>,
        ),
    );

    context.applyTo(SidebarItemSurface, sidebar =>
      sidebar.add(<SidebarItem icon={HomeIcon} to={path} text={label} />),
    );
  };
};
