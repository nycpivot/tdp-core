import React from 'react';
import {
  AppPluginInterface,
  SidebarItemSurface,
  ThemeSurface,
} from '@tpb/core-frontend';
import { AppTheme } from '@backstage/core-plugin-api';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { darkTheme, lightTheme } from '@backstage/theme';
import { Root } from './Root';

const BackstageLight: AppTheme = {
  id: 'backstage-light',
  title: 'Light',
  variant: 'light',
  Provider: ({ children }) => (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline>{children}</CssBaseline>
    </ThemeProvider>
  ),
};

const BackstageDark: AppTheme = {
  id: 'backstage-dark',
  title: 'Dark',
  variant: 'dark',
  Provider: ({ children }) => (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline>{children}</CssBaseline>
    </ThemeProvider>
  ),
};

export const ThemePlugin: AppPluginInterface = () => {
  return context => {
    context.applyTo(ThemeSurface, surface => {
      surface.addTheme(BackstageLight);
      surface.addTheme(BackstageDark);
      surface.setRootBuilder(children => (
        <Root sidebar={context.findSurface(SidebarItemSurface)}>
          {children}
        </Root>
      ));
    });
  };
};
