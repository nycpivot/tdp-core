import {
  AppPluginInterface,
  SidebarItemSurface,
  ThemeSurface,
} from '@tpb/core-frontend';
import React from 'react';
import { ClarityDark } from './ClarityDark';
import { ClarityLight } from './ClarityLight';
import { ClarityRoot } from './Root/Root';

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
  };
};
