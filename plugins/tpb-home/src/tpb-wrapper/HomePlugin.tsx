import React from 'react';
import { HomepageCompositionRoot } from '@backstage/plugin-home';
import {
  AppPluginInterface,
  AppRouteSurface,
  SidebarItemSurface,
  SurfaceStoreInterface,
} from '@tpb/core-frontend';
import { Route } from 'react-router';
import { SidebarItem } from '@backstage/core-components';
import HomeIcon from '@material-ui/icons/Home';
import { HomeSurface } from '../HomeSurface';
import HomePage from '../home/HomePage';

export const HomePlugin: AppPluginInterface =
  () => (context: SurfaceStoreInterface) => {
    // Add route to app
    context.applyWithDependency(
      AppRouteSurface,
      HomeSurface,
      (appRouteSurface, homeSurface) => {
        appRouteSurface.add(
          <Route path="/home" element={<HomepageCompositionRoot />}>
            <HomePage surface={homeSurface} />
          </Route>,
        );
      },
    );

    // Add sidebar entry
    context.applyTo(SidebarItemSurface, (sidebar: SidebarItemSurface) => {
      sidebar.addMainItem(
        <SidebarItem icon={HomeIcon} to="home" text="Home page" />,
      );
    });
  };
