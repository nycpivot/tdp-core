import React from 'react';
import { Route } from 'react-router';
import {
  AppPluginInterface,
  AppRouteSurface,
  RoutableConfig,
  SidebarItemSurface,
} from '@esback/core';
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
      routes.add(<Route path={`/${path}`} element={<ApiExplorerPage />} />);
    });

    context.applyTo(SidebarItemSurface, sidebar =>
      sidebar.addMainItem(
        <SidebarItem icon={Extension} to={path} text={label} />,
      ),
    );
  };
};
