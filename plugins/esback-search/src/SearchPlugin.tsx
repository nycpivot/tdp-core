import {
  AppPluginInterface,
  AppRouteSurface,
  RoutableConfig,
  SidebarItemSurface,
} from '@esback/core';
import React from 'react';
import { Route } from 'react-router';
import { SearchPage, SidebarSearchModal } from '@backstage/plugin-search';
import { searchPage } from './components/SearchPage';
import { SidebarGroup } from '@backstage/core-components';
import SearchIcon from '@material-ui/icons/Search';

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
      sidebar.addTopItem(
        <SidebarGroup label="Search" icon={<SearchIcon />} to="/search">
          <SidebarSearchModal />
        </SidebarGroup>,
      );
    });
  };
};
