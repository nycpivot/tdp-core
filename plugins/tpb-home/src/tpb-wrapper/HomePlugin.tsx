import React from 'react';
import { HomepageCompositionRoot } from '@backstage/plugin-home';
import {
  AppPluginInterface,
  AppRouteSurface,
  SidebarItemSurface,
  SurfaceStoreInterface,
} from '@tpb/core-frontend';
import { Route } from 'react-router';
import customizableHomePage from '../home/CustomizableHomePage';
import { SidebarItem } from '@backstage/core-components';
import HomeIcon from '@material-ui/icons/Home';
import { HomeSurface } from '../HomeSurface';

export const HomePlugin: AppPluginInterface =
  () => (context: SurfaceStoreInterface) => {
    // Add route to app
    context.applyWithDependency(
      AppRouteSurface,
      HomeSurface,
      (appRouteSurface, homeSurface) => {
        appRouteSurface.add(
          <Route path="/home" element={<HomepageCompositionRoot />}>
            {customizableHomePage(homeSurface)}
          </Route>,
        );
      },
    );
    // context.applyTo(AppRouteSurface, (routes: AppRouteSurface) => {
    //   routes.add(
    //     <Route path="/home" element={<HomepageCompositionRoot />}>
    //       <CustomizableHomePage />
    //     </Route>,
    //   );
    // });

    // Add sidebar entry
    context.applyTo(SidebarItemSurface, (sidebar: SidebarItemSurface) => {
      sidebar.addMainItem(
        <SidebarItem icon={HomeIcon} to="home" text="Home page" />,
      );
    });
  };
