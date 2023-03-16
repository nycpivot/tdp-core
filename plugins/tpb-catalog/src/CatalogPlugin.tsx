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
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';
import { SidebarItem } from '@backstage/core-components';
import { orgPlugin } from '@backstage/plugin-org';
import HomeIcon from '@material-ui/icons/Home';
import {
  AppPluginInterface,
  AppRouteSurface,
  RoutableConfig,
  SidebarItemSurface,
} from '@tpb/core';
import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';
import { entityPage } from './components/EntityPage';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { EntityPageSurface } from './EntityPageSurface';
import { CustomCatalogPage } from './components/CustomCatalogPage';
import { DefaultImportPage } from './components/CatalogImport/DefaultImportPage';

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
      routes.add(
        <Route path={`/${path}`} element={<CatalogIndexPage />}>
          <CustomCatalogPage />
        </Route>,
      );

      routes.addRouteBinder(({ bind }) => {
        bind(orgPlugin.externalRoutes, {
          catalogIndex: catalogPlugin.routes.catalogIndex,
        });
      });

      if (!config?.disableImport) {
        routes.add(
          <Route
            path="/catalog-import"
            permission={catalogEntityCreatePermission}
            element={<CatalogImportPage />}
          >
            <DefaultImportPage />
          </Route>,
        );

        routes.addRouteBinder(({ bind }) => {
          bind(scaffolderPlugin.externalRoutes, {
            registerComponent: catalogImportPlugin.routes.importPage,
          });
        });

        routes.addRouteBinder(({ bind }) => {
          bind(catalogPlugin.externalRoutes, {
            createComponent: catalogImportPlugin.routes.importPage,
          });
        });
      }

      if (!config?.disableGraph) {
        routes.add(
          <Route path="/catalog-graph" element={<CatalogGraphPage />} />,
        );
      }
    });

    context.applyWithDependency(
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
      sidebar.addMainItem(
        <SidebarItem icon={HomeIcon} to={path} text={label} />,
      ),
    );
  };
};
