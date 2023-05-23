type ColorHexValue = string;

type ClarityColor =
  | 'inputValue'
  | 'text'
  | 'icon'
  | 'border'
  | 'action'
  | 'success'
  | 'danger'
  | 'activeBackground'
  | 'componentBackground'
  | 'pageBackground'
  | 'textInverse';

type ColorAdditions = 'headerBackground' | 'navigationBackground';

type Color = ClarityColor | ColorAdditions;

type Palette = {
  [color in Color]: ColorHexValue;
};

type Hover = {
  button?: {
    outlined?: string;
  };
};

export const PURE_BLACK = '#000000';
export const PURE_WHITE = '#FFFFFF';

export const NEUTRAL_HUES = {
  50: '#FAFAFA',
  100: '#F2F2F2',
  200: '#E8E8E8',
  300: '#DEDEDE',
  400: '#CCCCCC',
  500: '#B3B3B3',
  600: '#8C8C8C',
  700: '#666666',
  800: '#454545',
  900: '#333333',
};

export const TAP_UI_KIT_LIGHT_PALETTE: Palette = {
  inputValue: '#000000',
  text: '#000000', // var(--cds-global-typography-color-500)
  icon: '#737373',
  border: '#CCCCCC',
  action: '#00608a', // var(--cds-global-typography-link-color)
  success: '#42810e', // var(--cds-alias-status-success)
  danger: '#e02200', // var(--cds-alias-status-danger)
  activeBackground: '#D9E4EA',
  componentBackground: '#FFFFFF',
  pageBackground: 'hsl(0, 0%, 98%)', // var(--cds-alias-object-app-background)
  textInverse: '#FFFFFF',
  headerBackground: '#002538',
  navigationBackground: '#EEEEEE',
};

export const TAP_UI_KIT_DARK_PALETTE: Palette = {
  inputValue: '#E9ECEF',
  text: '#fff', // var(--cds-global-color-white)
  icon: '#ADBBC4',
  border: '#0F171C',
  action: 'hsl(198, 100%, 59%)', // var(--cds-global-color-blue-400)
  success: 'hsl(93, 80%, 44%)', // var(--cds-global-color-green-500)
  danger: 'hsl(9, 100%, 65%)', // var(--cds-global-color-red-500)
  activeBackground: '#324F61',
  componentBackground: '#22343C',
  pageBackground: 'hsl(198, 30%, 15%)', // var(--cds-global-color-construction-1000)
  textInverse: '#000000',
  headerBackground: '#404E60',
  navigationBackground: '#17242B',
};

export const HOVER_PALLET: Hover = {
  button: {
    outlined: '#0079ad',
  },
};

/**
 * Ideally, we will add our custom colors to the palette in
 * the same way backstage is extending the material-ui palette
 * but in the meanwhile this util will help us reference the
 * TAP_UI_KIT palette that matches the active theme type
 */
export const getTapUIKitPalette = (themeType: 'light' | 'dark') => {
  return themeType === 'light'
    ? TAP_UI_KIT_LIGHT_PALETTE
    : TAP_UI_KIT_DARK_PALETTE;
};
