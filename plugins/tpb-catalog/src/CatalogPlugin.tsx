import React from 'react';
import {
  CatalogEntityPage,
  CatalogIndexPage,
  catalogPlugin,
} from '@backstage/plugin-catalog';
import {
  CatalogImportPage,
  catalogImportPlugin,
} from '@backstage/plugin-catalog-import';
import { SidebarItem } from '@backstage/core-components';
import { orgPlugin } from '@backstage/plugin-org';
import HomeIcon from '@material-ui/icons/Home';
import {
  AppPluginInterface,
  AppRouteSurface,
  RoutableConfig,
  SidebarItemSurface,
} from '@tpb/core-frontend';
import { ToggleFeature, ToggleRoute } from '@tpb/feature-flags';
import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';
import { entityPage } from './components/Catalog/EntityPage';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { EntityPageSurface } from './EntityPageSurface';
import { CustomCatalogPage } from './components/CustomCatalogPage';
import { DefaultImportPage } from './components/CatalogImport/DefaultImportPage';
import { RequirePermission } from '@backstage/plugin-permission-react';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';

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
        <ToggleRoute
          feature="customize.features.catalog.enabled"
          path={`/${path}`}
          element={<CatalogIndexPage />}
        >
          <CustomCatalogPage />
        </ToggleRoute>,
      );

      routes.addRouteBinder(({ bind }) => {
        bind(orgPlugin.externalRoutes, {
          catalogIndex: catalogPlugin.routes.catalogIndex,
        });
      });

      if (!config?.disableImport) {
        routes.add(
          <ToggleRoute
            feature="customize.features.catalog.enabled"
            path="/catalog-import"
            element={<CatalogImportPage />}
          >
            <RequirePermission permission={catalogEntityCreatePermission}>
              <DefaultImportPage />
            </RequirePermission>
          </ToggleRoute>,
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
          <ToggleRoute
            feature="customize.features.catalogGraph.enabled"
            path="/graph"
            element={<CatalogGraphPage />}
          />,
        );
      }
    });

    context.applyWithDependency(
      AppRouteSurface,
      EntityPageSurface,
      (routes, entityPageSurface) =>
        routes.add(
          <ToggleRoute
            feature="customize.features.catalog.enabled"
            path={`/${path}/:namespace/:kind/:name`}
            element={<CatalogEntityPage />}
          >
            {entityPage(entityPageSurface)}
          </ToggleRoute>,
        ),
    );

    context.applyTo(SidebarItemSurface, sidebar =>
      sidebar.addTopItem(
        <ToggleFeature feature="customize.features.catalog.showInSidebar">
          <SidebarItem icon={HomeIcon} to={path} text={label} />
        </ToggleFeature>,
      ),
    );
  };
};
