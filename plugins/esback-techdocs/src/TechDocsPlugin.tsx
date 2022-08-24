import React from 'react'
import { Route } from 'react-router'
import { SidebarItem } from '@backstage/core-components'
import { AppPluginInterface } from "@esback/core"
import { EntityTechdocsContent, TechDocsIndexPage, techdocsPlugin, TechDocsReaderPage } from '@backstage/plugin-techdocs'
import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
import { ReportIssue } from '@backstage/plugin-techdocs-module-addons-contrib';
import { catalogPlugin, EntityLayout } from '@backstage/plugin-catalog';
import LibraryBooks from '@material-ui/icons/LibraryBooks';

const techdocsEntityTab = (
  <EntityLayout.Route path="/docs" title="Docs">
    <EntityTechdocsContent>
      <TechDocsAddons>
        <ReportIssue />
      </TechDocsAddons>
    </EntityTechdocsContent>
  </EntityLayout.Route>
);

export const TechDocsPlugin: AppPluginInterface = (ctx) => {
  ctx.routeSurface.add(
    <Route path="/docs" element={<TechDocsIndexPage />} />
  );

  ctx.routeSurface.add(
    <Route
      path="/docs/:namespace/:kind/:name/*"
      element={<TechDocsReaderPage />}
    >
      <TechDocsAddons>
        <ReportIssue />
      </TechDocsAddons>
    </Route>
  );

  ctx.entityPageSurface.addServicePageTab(techdocsEntityTab);
  ctx.entityPageSurface.addWebsitePageTab(techdocsEntityTab);
  ctx.entityPageSurface.addDefaultPageTab(techdocsEntityTab);

  ctx.routeSurface.addRouteBinder(({ bind }) => {
    bind(catalogPlugin.externalRoutes, {
      viewTechDoc: techdocsPlugin.routes.docRoot,
    });
  });

  ctx.sidebarItemSurface.add(
    <SidebarItem icon={LibraryBooks} to="docs" text="Docs" />
  )
}