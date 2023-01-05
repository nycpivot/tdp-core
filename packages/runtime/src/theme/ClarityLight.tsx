import React from 'react';
import { createTheme } from './createTheme';
import { AppTheme } from '@backstage/core-plugin-api';
import { TAP_UI_KIT_LIGHT_PALETTE, HOVER_PALLET } from './palette';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const theme = createTheme({
  type: 'light',
  /**
   * Material UI palette
   */
  common: {
    black: 'hsl(0, 0%, 0%)', // --cds-global-color-black
    white: 'hsl(0, 0%, 100%)', // --cds-global-color-white
  },
  primary: {
    main: 'hsl(198, 100%, 34%)', // --cds-alias-status-info
    dark: 'hsl(198, 100%, 27%)', // --cds-alias-status-info-shade
    light: 'hsl(198, 100%, 95%)', // --cds-alias-status-info-tint
  },
  secondary: {
    main: '#8A39AC',
    dark: '#680094',
    light: '#AF73C9',
  },
  error: {
    main: 'hsl(9, 100%, 44%)', // --cds-alias-status-danger
    // dark: 'hsl(9, 100%, 38%)', // --cds-alias-status-danger-shade
    dark: 'hsl(9, 100%, 28%)', // --cds-alias-status-danger-dark
    light: 'hsl(9, 100%, 97%)', // --cds-alias-status-danger-tint
  },
  warning: {
    main: 'hsl(40, 100%, 59%)', // --cds-alias-status-warning
    // dark: 'hsl(39, 100%, 50%)', // --cds-alias-status-warning-shade
    dark: 'hsl(37, 100%, 32%)', // --cds-alias-status-warning-dark
    light: 'hsl(41, 100%, 92%)', // --cds-alias-status-warning-tint
  },
  info: {
    dark: 'hsl(198, 100%, 27%)', // --cds-alias-status-info-shade
    light: 'hsl(198, 100%, 95%)', // --cds-alias-status-info-tint
    main: 'hsl(198, 100%, 34%)', // --cds-alias-status-info
  },
  success: {
    dark: 'hsl(93, 80%, 23%)', // --cds-alias-status-success-shade
    light: 'hsl(93, 80%, 94%)', // --cds-alias-status-success-tint
    main: 'hsl(93, 80%, 28%)', // --cds-alias-status-success
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
  text: {
    primary: 'hsl(0, 0%, 0%)', // --cds-global-typography-color-500
    secondary: 'hsl(198, 28%, 18%)', // --cds-global-typography-color-400
    disabled: 'hsl(198, 14%, 36%)', // --cds-global-typography-color-200
    hint: 'hsl(198, 14%, 36%)', // --cds-global-typography-color-200
  },
  background: {
    paper: 'hsl(0, 0%, 100%)', // --cds-alias-object-container-background
    default: 'hsl(0, 0%, 98%)', // --cds-alias-object-app-background
  },
  action: {
    hover: HOVER_PALLET.button?.outlined,
  },

  /**
   * Backstage palette additions
   */
  // `status` defines the color of the `Status` component
  status: {
    ok: 'var(--cds-alias-status-success)', // hsl(93, 80%, 28%)
    warning: 'var(--cds-alias-status-warning)', // hsl(40, 100%, 59%)
    error: 'var(--cds-alias-status-danger)', // hsl(9, 100%, 44%)
    running: 'var(--cds-alias-status-info)', // hsl(198, 100%, 34%)
    pending: 'var(--cds-alias-status-alt)', // hsl(283, 80%, 36%)
    aborted: 'var(--cds-alias-status-neutral)', // hsl(198, 14%, 36%)
  },
  border: '#E8E8E8',
  textContrast: TAP_UI_KIT_LIGHT_PALETTE.inputValue,
  textVerySubtle: '#DEDEDE',
  textSubtle: TAP_UI_KIT_LIGHT_PALETTE.text,
  highlight: '#666666',
  errorBackground: 'hsl(9, 100%, 44%)', // --cds-alias-status-danger
  warningBackground: 'hsl(40, 100%, 59%)', // --cds-alias-status-warning
  infoBackground: 'hsl(198, 100%, 34%)', // --cds-alias-status-info
  errorText: '#C21D00',
  infoText: '#004B6B',
  warningText: '#000000',
  linkHover: 'hsl(198, 100%, 21%)', // --cds-global-typography-link-color-hover
  link: 'hsl(198, 100%, 27%)', // --cds-global-typography-link-color
  gold: 'hsl(44, 100%, 47%)', // --cds-global-color-yellow-500
  navigation: {
    color: TAP_UI_KIT_LIGHT_PALETTE.icon,
    background: TAP_UI_KIT_LIGHT_PALETTE.navigationBackground,
    indicator: TAP_UI_KIT_LIGHT_PALETTE.action,
    selectedColor: TAP_UI_KIT_LIGHT_PALETTE.icon,
  },
  tabbar: {
    indicator: TAP_UI_KIT_LIGHT_PALETTE.action,
  },
  bursts: {
    fontColor: '#000000',
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
    text: 'hsl(0, 0%, 100%)', // --cds-global-color-white
    // Backstage also provide `warning` but the linter refuses to recognize it
  },
});
export const ClarityLight: AppTheme = {
  id: 'clarity-light',
  title: 'Clarity Light',
  variant: 'light',
  Provider: ({ children }) => (
    <ThemeProvider theme={theme}>
      <CssBaseline>{children}</CssBaseline>
    </ThemeProvider>
  ),
};
