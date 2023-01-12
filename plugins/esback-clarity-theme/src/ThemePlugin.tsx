import {
  AppPluginInterface,
  SidebarItemSurface,
  ThemeSurface,
} from '@esback/core';
import React from 'react';
import { ClarityDark } from './ClarityDark';
import { ClarityLight } from './ClarityLight';
import { ClarityRoot } from './Root';
import './style/clarity.css';

export const ThemePlugin: AppPluginInterface = () => {
  return context => {
    context.applyTo(ThemeSurface, surface => {
      surface.addTheme(ClarityLight);
      surface.addTheme(ClarityDark);
      surface.setRootBuilder(children => (
        <ClarityRoot sidebar={context.getSurfaceState(SidebarItemSurface)}>
          {children}
        </ClarityRoot>
      ));
    });
  };
};
