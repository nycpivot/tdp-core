import {
  AppPluginInterface,
  AppRouteSurface,
  RoutableConfig,
  SidebarItemSurface,
} from '@tpb/core';
import React from 'react';
import { SearchPage, SidebarSearchModal } from '@backstage/plugin-search';
import { searchPage } from './components/SearchPage';
import { ToggleFeature, ToggleRoute } from '@tpb/core-frontend';

export const SearchPlugin: AppPluginInterface<RoutableConfig> = config => {
  const { path } = {
    path: 'search',
    ...config,
  };

  return context => {
    context.applyTo(AppRouteSurface, routes => {
      routes.add(
        <ToggleRoute
          feature="customize.features.search.enabled"
          path={`/${path}`}
          element={<SearchPage />}
        >
          {searchPage}
        </ToggleRoute>,
      );
    });

    context.applyTo(SidebarItemSurface, sidebar => {
      sidebar.addTopItem(
        <ToggleFeature feature="customize.features.search.showInSidebar">
          <SidebarSearchModal />
        </ToggleFeature>,
      );
    });
  };
};
