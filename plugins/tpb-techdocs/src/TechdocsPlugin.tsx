import React from 'react';
import {
  AppPluginInterface,
  AppRouteSurface,
  RoutableConfig,
  SidebarItemSurface,
} from '@tpb/core-frontend';
import { ToggleFeature, ToggleRoute } from '@tpb/feature-flags';
import { SidebarItem } from '@backstage/core-components';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import {
  TechDocsIndexPage,
  techdocsPlugin,
  TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
import { catalogPlugin } from '@backstage/plugin-catalog';

export const TechdocsPlugin: AppPluginInterface<RoutableConfig> = config => {
  const { label, path } = {
    label: 'Docs',
    path: 'docs',
    ...config,
  };

  return context => {
    context.applyTo(AppRouteSurface, routes => {
      routes.add(
        <ToggleRoute
          feature="customize.features.docs.enabled"
          path={`/${path}`}
          element={<TechDocsIndexPage />}
        />,
      );

      routes.add(
        <ToggleRoute
          feature="customize.features.docs.enabled"
          path={`/${path}/:namespace/:kind/:name/*`}
          element={<TechDocsReaderPage />}
        />,
      );

      routes.addRouteBinder(({ bind }) => {
        bind(catalogPlugin.externalRoutes, {
          viewTechDoc: techdocsPlugin.routes.docRoot,
        });
      });
    });

    context.applyTo(SidebarItemSurface, sidebar =>
      sidebar.addMainItem(
        <ToggleFeature feature="customize.features.docs.showInSidebar">
          <SidebarItem icon={LibraryBooks} to={path} text={label} />
        </ToggleFeature>,
      ),
    );
  };
};
