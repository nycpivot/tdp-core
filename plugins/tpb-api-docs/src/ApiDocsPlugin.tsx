import React from 'react';
import {
  AppPluginInterface,
  AppRouteSurface,
  RoutableConfig,
  SidebarItemSurface,
} from '@tpb/core';
import { ToggleFeature, ToggleRoute } from '@tpb/feature-flags';
import { SidebarItem } from '@backstage/core-components';
import { ApiExplorerPage } from '@backstage/plugin-api-docs';
import Extension from '@material-ui/icons/Extension';

export const ApiDocsPlugin: AppPluginInterface<RoutableConfig> = config => {
  const { label, path } = {
    label: 'APIs',
    path: 'api-docs',
    ...config,
  };

  return context => {
    context.applyTo(AppRouteSurface, routes => {
      routes.add(
        <ToggleRoute
          feature="customize.features.apiDocs.enabled"
          path={`/${path}`}
          element={<ApiExplorerPage />}
        />,
      );
    });

    context.applyTo(SidebarItemSurface, sidebar =>
      sidebar.addMainItem(
        <ToggleFeature feature="customize.features.apiDocs.showInSidebar">
          <SidebarItem icon={Extension} to={path} text={label} />
        </ToggleFeature>,
      ),
    );
  };
};
