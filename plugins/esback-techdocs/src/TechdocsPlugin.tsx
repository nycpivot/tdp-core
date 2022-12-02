import React from 'react';
import { Route } from 'react-router';
import {
  AppPluginInterface,
  AppRouteSurface,
  RoutableConfig,
  SidebarItemSurface,
} from '@esback/core';
import { SidebarItem } from '@backstage/core-components';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import {
  TechDocsIndexPage,
  techdocsPlugin,
  TechDocsReaderLayout,
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
      routes.add(<Route path={`/${path}`} element={<TechDocsIndexPage />} />);

      routes.add(
        <Route
          path={`/${path}/:namespace/:kind/:name/*`}
          element={
            <TechDocsReaderPage>
              <TechDocsReaderLayout withSearch={false} />
            </TechDocsReaderPage>
          }
        />,
      );

      routes.addRouteBinder(({ bind }) => {
        bind(catalogPlugin.externalRoutes, {
          viewTechDoc: techdocsPlugin.routes.docRoot,
        });
      });
    });

    context.applyTo(SidebarItemSurface, sidebar =>
      sidebar.add(<SidebarItem icon={LibraryBooks} to={path} text={label} />),
    );
  };
};
