import { createTheme as createMuiTheme } from '@material-ui/core';
import {
  BackstagePaletteOptions,
  BackstageTheme,
  BackstageThemeOptions,
  PageTheme,
  shapes,
} from '@backstage/theme';
import { createTypography } from './createTypography';
import { ComponentProps, createOverrides } from './createOverrides';

export const createTheme = (
  paletteOptions: BackstagePaletteOptions,
): BackstageTheme => {
  // Use the same theme for all pages
  const pageTheme: PageTheme = {
    colors: [paletteOptions.grey?.['50'] ?? ''], // --clr-global-app-background = #fafafa
    shape: shapes.round,
    backgroundImage: '',
    fontColor: paletteOptions.text?.primary ?? '',
  };

  const themeOptions: BackstageThemeOptions = {
    palette: paletteOptions,
    props: ComponentProps,
    typography: createTypography,
    page: pageTheme,
    getPageTheme: _ => pageTheme,
  };

  const baseTheme = createMuiTheme(themeOptions) as BackstageTheme;
  const overrides = createOverrides(baseTheme);

  return { ...baseTheme, overrides } as BackstageTheme;
};
