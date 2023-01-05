import React from 'react';
import { createTheme } from './createTheme';
import { AppTheme } from '@backstage/core-plugin-api';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { TAP_UI_KIT_DARK_PALETTE, PURE_BLACK, HOVER_PALLET } from './palette';

const theme = createTheme({
  type: 'dark',
  /**
   * Material UI palette
   */
  common: {
    black: 'hsl(0, 0%, 0%)', // --cds-global-color-black
    white: 'hsl(0, 0%, 100%)', // --cds-global-color-white
  },
  primary: {
    main: 'hsl(198, 100%, 59%)', // --cds-alias-status-info
    dark: 'hsl(198, 100%, 34%)', // --cds-alias-status-info-shade
    light: 'hsl(198, 100%, 34%)', // --cds-alias-status-info-tint
  },
  secondary: {
    main: '#D2AAE4',
    dark: '#D2AAE4',
    light: '#D2AAE4',
    contrastText: PURE_BLACK,
  },
  error: {
    main: 'hsl(9, 100%, 65%)', // --cds-alias-status-danger
    // dark: 'hsl(9, 100%, 44%)', // --cds-alias-status-danger-shade
    dark: 'hsl(9, 100%, 38%)', // --cds-alias-status-danger-dark
    light: 'hsl(9, 100%, 44%)', // --cds-alias-status-danger-tint
  },
  warning: {
    main: 'hsl(41, 100%, 70%)', // --cds-alias-status-warning
    // dark: 'hsl(40, 100%, 59%)', // --cds-alias-status-warning-shade
    dark: 'hsl(40, 100%, 59%)', // --cds-alias-status-warning-dark
    light: 'hsl(40, 100%, 59%)', // --cds-alias-status-warning-tint
  },
  info: {
    main: 'hsl(198, 100%, 59%)', // --cds-alias-status-info
    dark: 'hsl(198, 100%, 34%)', // --cds-alias-status-info-shade
    light: 'hsl(198, 100%, 34%)', // --cds-alias-status-info-tint
  },
  success: {
    dark: 'hsl(93, 80%, 28%)', // --cds-alias-status-success-shade
    light: 'hsl(93, 80%, 28%)', // --cds-alias-status-success-tint
    main: 'hsl(93, 80%, 44%)', // --cds-alias-status-success
  },
  background: {
    paper: 'hsl(198, 28%, 18%)', // --cds-alias-object-container-background
    default: 'hsl(198, 30%, 15%)', // --cds-alias-object-app-background
  },
  text: {
    primary: TAP_UI_KIT_DARK_PALETTE.text,
    secondary: TAP_UI_KIT_DARK_PALETTE.text,
  },
  grey: {
    // --cds-global-color-gray-???
    50: 'hsl(0, 0%, 98%)',
    100: 'hsl(0, 0%, 95%)',
    200: 'hsl(0, 0%, 91%)',
    300: 'hsl(0, 0%, 87%)',
    400: 'hsl(0, 0%, 80%)',
    500: 'hsl(0, 0%, 70%)',
    600: 'hsl(0, 0%, 55%)',
    700: 'hsl(0, 0%, 40%)',
    800: 'hsl(0, 0%, 27%)',
    900: 'hsl(0, 0%, 20%)',
  },

  /**
   * Backstage palette additions
   */
  // `status` defines the color of the `Status` component
  status: {
    ok: 'var(--cds-alias-status-success)',
    warning: 'var(--cds-alias-status-warning)',
    error: 'var(--cds-alias-status-danger)',
    running: 'var(--cds-alias-status-info)',
    pending: 'var(--cds-alias-status-alt)',
    aborted: 'var(--cds-alias-status-neutral)',
  },
  border: '#E8E8E8',
  textContrast: TAP_UI_KIT_DARK_PALETTE.inputValue,
  textVerySubtle: '#DEDEDE',
  textSubtle: TAP_UI_KIT_DARK_PALETTE.text,
  highlight: '#666666',
  errorBackground: '#FAFAFA',
  warningBackground: '#D69A00',
  infoBackground: '#E8E8E8',
  errorText: '#C21D00',
  infoText: '#004B6B',
  warningText: '#000000',
  linkHover: '#179BD3',
  link: '#004B6B',
  gold: '#E6B000',
  navigation: {
    color: TAP_UI_KIT_DARK_PALETTE.icon,
    background: TAP_UI_KIT_DARK_PALETTE.navigationBackground,
    indicator: TAP_UI_KIT_DARK_PALETTE.action,
    selectedColor: TAP_UI_KIT_DARK_PALETTE.icon,
  },
  tabbar: {
    indicator: TAP_UI_KIT_DARK_PALETTE.action,
  },
  bursts: {
    fontColor: '#ffffff',
    slackChannelText: '#DEDEDE',
    backgroundColor: {
      default: '#9E57BC',
    },
    gradient: {
      linear: 'linear-gradient(-137deg, #bce49a 0%, #255200 100%)',
    },
  },
  pinSidebarButton: {
    icon: '#000000',
    background: '#B3B3B3',
  },
  banner: {
    error: '#DB2100',
    info: '#0072A3',
    link: '#000000',
    text: PURE_BLACK,
  },
  action: {
    hover: HOVER_PALLET.button?.outlined,
  },
});

export const ClarityDark: AppTheme = {
  id: 'clarity-dark',
  title: 'Clarity Dark',
  variant: 'dark',
  Provider: ({ children }) => (
    <ThemeProvider theme={theme}>
      <CssBaseline>{children}</CssBaseline>
    </ThemeProvider>
  ),
};
