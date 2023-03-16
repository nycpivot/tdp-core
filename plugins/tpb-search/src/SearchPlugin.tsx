import {
  AppPluginInterface,
  AppRouteSurface,
  RoutableConfig,
  SidebarItemSurface,
} from '@tpb/core';
import React from 'react';
import { Route } from 'react-router';
import { SearchPage, SidebarSearchModal } from '@backstage/plugin-search';
import { searchPage } from './components/SearchPage';

export const SearchPlugin: AppPluginInterface<RoutableConfig> = config => {
  const { path } = {
    path: 'search',
    ...config,
  };

  return context => {
    context.applyTo(AppRouteSurface, routes => {
      routes.add(
        <Route path={`/${path}`} element={<SearchPage />}>
          {searchPage}
        </Route>,
      );
    });

    context.applyTo(SidebarItemSurface, sidebar => {
      sidebar.addTopItem(<SidebarSearchModal />);
    });
  };
};
