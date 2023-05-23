import {
  AppPluginInterface,
  SidebarItemSurface,
  ThemeSurface,
} from '@tpb/core';
import React from 'react';
import { ClarityDark } from './ClarityDark';
import { ClarityLight } from './ClarityLight';
import { ClarityRoot } from './Root/Root';
import { SidebarItem } from '@backstage/core-components';
import SettingsIcon from '@material-ui/icons/Settings';

export const ThemePlugin: AppPluginInterface = () => {
  return context => {
    context.applyTo(ThemeSurface, surface => {
      surface.addTheme(ClarityLight);
      surface.addTheme(ClarityDark);
      surface.setRootBuilder(children => (
        <ClarityRoot sidebar={context.findSurface(SidebarItemSurface)}>
          {children}
        </ClarityRoot>
      ));
    });
    context.applyTo(SidebarItemSurface, sidebar => {
      sidebar.addMainItem(
        <SidebarItem icon={SettingsIcon} to="settings" text="Settings" />,
      );
    });
  };
};
