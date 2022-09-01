import React from 'react'
import { Route } from 'react-router'
import { SidebarItem } from '@backstage/core-components'
import { AppPluginInterface, RoutableConfig } from "@esback/core"
import { EntityTechdocsContent, TechDocsIndexPage, techdocsPlugin, TechDocsReaderPage } from '@backstage/plugin-techdocs'
import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
import { ReportIssue } from '@backstage/plugin-techdocs-module-addons-contrib';
import { catalogPlugin, EntityLayout } from '@backstage/plugin-catalog';
import LibraryBooks from '@material-ui/icons/LibraryBooks';

interface TechDocsConfig {
  entityTab?: RoutableConfig
  sidebar?: RoutableConfig
}

export const TechDocsPlugin: AppPluginInterface<TechDocsConfig> = (config) => {
  const sidebar = {
    path: "docs",
    label: "Docs",
    ...config?.sidebar
  }
  const entityTab = {
    path: "docs",
    label: "Docs",
    ...config?.entityTab
  }

  const techdocsEntityTab = (
    <EntityLayout.Route path={`/${entityTab.path!}`} title={entityTab.label!}>
      <EntityTechdocsContent>
        <TechDocsAddons>
          <ReportIssue />
        </TechDocsAddons>
      </EntityTechdocsContent>
    </EntityLayout.Route>
  );

  return {
    entityPage: (surface) => {
      surface.addServicePageTab(techdocsEntityTab);
      surface.addWebsitePageTab(techdocsEntityTab);
      surface.addDefaultPageTab(techdocsEntityTab);
    },
    routes: (surface) => {
      surface.add(
        <Route path={`/${sidebar.path}`} element={<TechDocsIndexPage />} />
      );

      surface.add(
        <Route
          path={`/${sidebar.path}/:namespace/:kind/:name/*`}
          element={<TechDocsReaderPage />}
        >
          <TechDocsAddons>
            <ReportIssue />
          </TechDocsAddons>
        </Route>
      );


      surface.addRouteBinder(({ bind }) => {
        bind(catalogPlugin.externalRoutes, {
          viewTechDoc: techdocsPlugin.routes.docRoot,
        });
      });
    },
    sidebarItems: (surface) => surface.add(<SidebarItem icon={LibraryBooks} to={sidebar.path!} text={sidebar.label!} />)
  }
}