import { BackstageOverrides } from '@backstage/core-components';
import { BackstageOverrides as BackstageCatalogOverrides } from '@backstage/plugin-catalog';
import { LabComponentNameToClassKey } from '@material-ui/lab/themeAugmentation/overrides';
import {
  BackstageTheme,
  createThemeOverrides as createBackstageOverrides,
} from '@backstage/theme';
import { ComponentsProps } from '@material-ui/core/styles/props';
import { HeaderClassKey } from './Header/Header';
import { LogoIconClassKey } from './Header/LogoIcon';
import { Overrides } from '@material-ui/core/styles/overrides';
import { RootClassKey } from './Root/Root';
import { SidebarClassKey } from './Sidebar/Sidebar';
import { SidebarPageClassKey } from './Sidebar/SidebarPage';
import { StyleRules } from '@material-ui/core/styles/withStyles';

type MaterialUILabOverrides = {
  [Name in keyof LabComponentNameToClassKey]?: Partial<
    StyleRules<LabComponentNameToClassKey[Name]>
  >;
};

type ClarityInternalComponentsOverrides = {
  [Name in keyof ClarityComponentNameToClassKey]?: Partial<
    StyleRules<ClarityComponentNameToClassKey[Name]>
  >;
};

type ClarityOverrides = Overrides &
  MaterialUILabOverrides &
  BackstageOverrides &
  BackstageCatalogOverrides &
  ClarityInternalComponentsOverrides;

export interface ClarityComponentNameToClassKey {
  ClarityHeader: HeaderClassKey;
  ClarityLogoIcon: LogoIconClassKey;
  ClarityRoot: RootClassKey;
  ClaritySidebar: SidebarClassKey;
  ClaritySidebarPage: SidebarPageClassKey;
}

export const ComponentProps: ComponentsProps = {
  MuiButtonBase: {
    disableRipple: true,
  },
  MuiGrid: {
    spacing: 3,
  },
  MuiSwitch: {
    color: 'primary',
  },
};

const createClarityOverrides = (theme: BackstageTheme): ClarityOverrides => {
  // Clarity and Backstage use different mechanisms to switch between light and
  // dark mode. We create this to insert into our wrapper so we can take full
  // advantage of Clarity's design tokens.
  let darkOverrides = {};
  if (theme.palette.type === 'dark') {
    darkOverrides = {
      '--cds-global-typography-color-500': 'var(--cds-global-color-white)',
      '--cds-global-typography-color-400':
        'var(--cds-global-color-construction-100)',
      '--cds-global-typography-color-300':
        'var(--cds-global-color-construction-200)',
      '--cds-global-typography-color-200':
        'var(--cds-global-color-construction-600)',
      '--cds-global-typography-color-100':
        'var(--cds-global-color-construction-900)',
      '--cds-global-typography-link-color': 'var(--cds-global-color-blue-400)',
      '--cds-global-typography-link-color-hover':
        'var(--cds-global-color-blue-500)',
      '--cds-global-typography-link-color-visited':
        'var(--cds-global-color-lavender-300)',
      '--cds-global-typography-link-color-visited-hover':
        'var(--cds-global-color-lavender-400)',
      '--cds-alias-object-app-background':
        'var(--cds-global-color-construction-1000)',
      '--cds-alias-object-container-background':
        'var(--cds-global-color-construction-900)',
      '--cds-alias-object-container-background-tint':
        'var(--cds-global-color-construction-1000)',
      '--cds-alias-object-container-background-shade':
        'var(--cds-global-color-construction-800)',
      '--cds-alias-object-container-border-color':
        'var(--cds-global-color-black)',
      '--cds-alias-object-overlay-background':
        'var(--cds-global-color-construction-900)',
      '--cds-alias-object-border-color':
        'var(--cds-global-color-construction-500)',
      '--cds-alias-object-border-color-tint':
        'var(--cds-global-color-construction-400)',
      '--cds-alias-object-border-color-shade':
        'var(--cds-global-color-construction-600)',
      '--cds-alias-object-shadow-100':
        '0 var(--cds-global-space-1) var(--cds-global-space-2) 0 var(--cds-alias-object-opacity-300)',
      '--cds-alias-object-shadow-200':
        '0 var(--cds-global-space-1) var(--cds-global-space-2) 0 var(--cds-alias-object-opacity-200)',
      '--cds-alias-object-shadow-300':
        '0 var(--cds-global-space-1) var(--cds-global-space-2) 0 var(--cds-alias-object-opacity-100)',
      '--cds-alias-object-interaction-color':
        'var(--cds-global-color-construction-200)',
      '--cds-alias-object-interaction-color-hover':
        'var(--cds-global-color-construction-50)',
      '--cds-alias-object-interaction-color-active':
        'var(--cds-global-color-construction-100)',
      '--cds-alias-object-interaction-color-selected':
        'var(--cds-global-color-construction-200)',
      '--cds-alias-object-interaction-color-disabled':
        'var(--cds-global-color-construction-600)',
      '--cds-alias-object-interaction-background':
        'var(--cds-global-color-construction-900)',
      '--cds-alias-object-interaction-background-hover':
        'var(--cds-global-color-construction-700)',
      '--cds-alias-object-interaction-background-active':
        'var(--cds-global-color-construction-800)',
      '--cds-alias-object-interaction-background-selected':
        'var(--cds-global-color-construction-700)',
      '--cds-alias-object-interaction-background-disabled':
        'var(--cds-global-color-construction-900)',
      '--cds-alias-object-interaction-background-highlight':
        'var(--cds-global-color-blue-400)',
      '--cds-alias-status-tint': 'transparent',
      '--cds-alias-status-info': 'var(--cds-global-color-blue-400)',
      '--cds-alias-status-info-tint': 'var(--cds-global-color-blue-700)',
      '--cds-alias-status-info-shade': 'var(--cds-global-color-blue-700)',
      '--cds-alias-status-success': 'var(--cds-global-color-green-500)',
      '--cds-alias-status-success-tint': 'var(--cds-global-color-green-700)',
      '--cds-alias-status-success-shade': 'var(--cds-global-color-green-700)',
      '--cds-alias-status-warning': 'var(--cds-global-color-ochre-400)',
      '--cds-alias-status-warning-tint': 'var(--cds-global-color-ochre-500)',
      '--cds-alias-status-warning-shade': 'var(--cds-global-color-ochre-500)',
      '--cds-alias-status-warning-dark': 'var(--cds-global-color-ochre-500)',
      '--cds-alias-status-danger': 'var(--cds-global-color-red-500)',
      '--cds-alias-status-danger-dark': 'var(--cds-global-color-red-800)',
      '--cds-alias-status-danger-tint': 'var(--cds-global-color-red-700)',
      '--cds-alias-status-danger-shade': 'var(--cds-global-color-red-700)',
      '--cds-alias-status-neutral': 'var(--cds-global-color-construction-300)',
      '--cds-alias-status-neutral-tint':
        'var(--cds-global-color-construction-500)',
      '--cds-alias-status-neutral-shade':
        'var(--cds-global-color-construction-500)',
      '--cds-alias-status-disabled': 'var(--cds-global-color-construction-600)',
      '--cds-alias-status-disabled-tint':
        'var(--cds-global-color-construction-700)',
      '--cds-alias-status-disabled-shade':
        'var(--cds-global-color-construction-800)',
    };
  }

  return {
    MuiCssBaseline: {
      '@global': {
        ':root': {
          ...darkOverrides,
        },
        html: {
          // from `@cds/core/styles/module.reset.css`
          fontSize: 'calc((var(--cds-global-base) / 16) * 100%)',
          boxSizing: 'border-box !important' as any,
        },
        body: {
          // typography applied from `body2` in `createTypography.ts`
        },
        '*, *:before, *:after': {
          // from `@cds/core/styles/module.reset.css`
          boxSizing: 'inherit !important' as any,
        },
      },
    },

    BackstageHeader: {
      title: {
        color: 'var(--color)',
      },
      subtitle: {
        color: 'var(--color)',
      },
      type: {
        color: 'var(--color)',
      },
    },

    ClaritySidebar: {
      root: {
        '--background':
          'var(--cds-alias-object-container-background, var(--cds-global-color-white, white))',
        // Clarity Core's Storybook claims `--collapsed-width` should be `xxl`,
        // which is computed to be 48px, but the current @cds/core package
        // defines `xxl` has 96px (at default rem). This value has been updated
        // to `xl` to match the expected pixel count.
        '--collapsed-width': 'var(--cds-global-layout-space-xl, 3rem)',
        '--color':
          'var(--cds-global-typography-color-500, var(--cds-global-color-black, black))',
        '--expanded-width': 'calc(var(--cds-global-space-6, 0.75rem) * 20)',

        backgroundColor: 'var(--background)',
        color: 'var(--color)',
      },
      // See `BackstageSidebarItem` for navigation item properties
    },

    BackstageSidebarItem: {
      root: {
        '--line-height':
          'var(--cds-alias-object-interaction-touch-target, 2.25rem)',
        '--padding': '0 var(--cds-global-space-5, 0.5rem)',
        '--font-size': 'inherit',
        '--font-weight': 'inherit',

        background: 'var(--background)',
        height: 'unset',
        lineHeight: 'var(--line-height)',
        minHeight: 'var(--line-height)',
        padding: 'var(--padding)',
        textDecoration: 'none',
      },
      buttonItem: {
        padding: 'var(--padding)',
      },
      highlightable: {
        '&:hover': {
          background: 'var(--cds-alias-object-interaction-background-hover)',
        },
      },
      closed: {
        justifyContent: 'unset',
        width: 'var(--collapsed-width)',
      },
      iconContainer: {
        marginRight: 0,
        height: 'var(--cds-global-space-7, 1rem)',
        width: 'var(--cds-global-space-7, 1rem)',
        minHeight: 'var(--cds-global-space-7, 1rem)',
        minWidth: 'var(--cds-global-space-7, 1rem)',
      },
      selected: {
        '--background':
          'var(--cds-alias-object-interaction-background-selected, var(--cds-global-color-blue-50, #e6f7ff))',
        '--color':
          'var(--cds-alias-object-interaction-color, var(--cds-global-color-construction-700, #3a4d55))',

        '-webkit-box-shadow':
          'inset var(--cds-alias-object-border-width-300,.1875rem) 0 0 0 var(--cds-alias-object-interaction-background-highlight,var(--cds-global-color-blue-700,#0079ad))',
        boxShadow:
          'inset var(--cds-alias-object-border-width-300,.1875rem) 0 0 0 var(--cds-alias-object-interaction-background-highlight,var(--cds-global-color-blue-700,#0079ad))',

        '&$closed': {
          width: 'var(--collapsed-width)',
        },
        '&$root': {
          borderLeft: 'none',
          color: 'var(--color)',
        },
        '& $iconContainer': {
          marginLeft: 0,
        },
      },
      label: {
        color:
          'var(--cds-alias-object-interaction-color, var(--cds-global-color-construction-700, #3a4d55))',
        fontSize: 'var(--font-size)',
        fontWeight: 'var(--font-weight)' as any,
        paddingLeft: 'var(--cds-global-space-6, .75rem)',
        lineHeight: 'var(--lineHeight)',
      },
      open: {
        width: 'var(--expanded-width)',
      },
    },

    BackstageGauge: {
      overlay: {
        color: theme.palette.textContrast,
      },
      circle: {
        '& > path.rc-progress-circle-path': {
          stroke: `${theme.palette.primary.main} !important`,
        },
      },
    },

    MuiListItem: {
      button: {
        '&:hover': {
          backgroundColor:
            'var(--cds-alias-object-interaction-background-hover)',
        },
      },
    },

    MuiAutocomplete: {
      endAdornment: {
        // move up by half the height of the button
        top: 'calc(50% - (var(--cds-global-space-11, 2.25rem) / 2))',
      },
      inputRoot: {
        '&[class*="MuiOutlinedInput-root"][class*="MuiOutlinedInput-marginDense"]':
          {
            '& .MuiAutocomplete-input': {
              padding: 0,
            },
          },
      },
      option: {
        '&:hover': {
          backgroundColor:
            'var(--cds-alias-object-interaction-background-hover)',
        },
      },
      tag: {
        '&:first-child': {
          marginLeft: 0,
        },
      },
      tagSizeSmall: {
        margin: '0 2px',
      },
    },
    MuiTreeItem: {
      label: {
        '&:hover': {
          backgroundColor:
            'var(--cds-alias-object-interaction-background-hover)',
        },
      },
    },

    //
    // Table
    //

    MuiTable: {
      root: {
        '--background':
          'var(--cds-alias-object-container-background, var(--cds-global-color-white, white))',
        '--color':
          'var(--cds-global-typography-color-400, var(--cds-global-color-construction-900, #21333b))',
        '--border-radius': 'var(--cds-alias-object-border-radius-100, 0.25rem)',
        '--border':
          'var(--cds-alias-object-border-width-100, 0.0625rem) solid var(--cds-alias-object-border-color, var(--cds-global-color-construction-200, #cbd4d8))',
        '--header-background':
          'var(--cds-alias-object-container-background-tint, var(--cds-global-color-construction-50, #f1f6f8))',
        '--header-border':
          'var(--cds-alias-object-border-width-100, 0.0625rem) solid var(--cds-alias-object-border-color, var(--cds-global-color-construction-200, #cbd4d8))',
        '--row-border':
          'var(--cds-alias-object-border-width-100, 0.0625rem) solid var(--cds-alias-object-border-color-tint, var(--cds-global-color-construction-100, #e3eaed))',
        '--column-border':
          'var(--cds-alias-object-border-width-100, 0.0625rem) solid var(--cds-alias-object-border-color-tint, var(--cds-global-color-construction-100, #e3eaed))',
        '--cell-padding':
          'var(--cds-global-space-5, 0.5rem) var(--cds-global-space-6, 0.75rem)',

        borderSpacing: 0,
        color: 'var(--color)',
      },
    },
    MuiTableBody: {},
    MuiTableRow: {
      root: {
        fontSize: '14px',
        lineHeight: '18px',

        '&$hover:hover': {
          backgroundColor:
            'var(--cds-alias-object-interaction-background-hover)',
        },
      },
    },
    MuiTableContainer: {
      root: {
        border:
          'var(--cds-alias-object-border-width-100, 0.0625rem) solid var(--cds-alias-object-border-color, var(--cds-global-color-construction-200, #cbd4d8))',
        borderTopStyle: 'none',
      },
    },
    MuiTableCell: {
      root: {
        '--cell-padding':
          'var(--cds-global-space-5, 0.5rem) var(--cds-global-space-6, 0.75rem)',
        overflow: 'hidden',
        padding: 'var(--cell-padding)',
        verticalAlign: 'middle',
        wordBreak: 'break-word',
        border: 'var(--border)',
        borderRightStyle: 'none',
        borderLeftStyle: 'none',
      },
      sizeSmall: {
        // For the moment we don't want to allow `sizeSmall` tables, so we
        // invalidate a few things to void the class.
        padding: '',
      },
      head: {
        backgroundColor: 'var(--header-background) !important',
        border: 'var(--header-border)',
        borderRightStyle: 'none',
        borderLeftStyle: 'none',
        color: theme.palette.text.primary,
        overflow: 'hidden',
        textTransform: 'none !important' as any,
        wordBreak: 'break-word',
      },
    },
    MuiTablePagination: {
      input: {
        fontSize: 'var(--cds-global-typography-body-font-size)',
      },
    },

    //
    // Backstage Table
    //

    BackstageTable: {
      root: {
        border:
          'var(--cds-alias-object-border-width-100, 0.0625rem) solid var(--cds-alias-object-container-border-color, var(--cds-global-color-construction-200, #cbd4d8))',
        borderColor: 'var(--cds-alias-object-container-border-color)',
        borderRadius: 'var(--cds-alias-object-border-radius-100)',
      },
    },
    BackstageTableHeader: {
      header: {
        background: theme.palette.background.default,
        color: theme.palette.text.primary,
        padding: 'var(--cell-padding)',
      },
    },

    //
    // Elevation
    //

    MuiPaper: {
      elevation2: {
        boxShadow:
          'var(--cds-alias-object-shadow-100, 0 calc(1 / var(--cds-global-base, 20) * 1rem) calc(3 / var(--cds-global-base, 20) * 1rem) 0 rgba(27, 43, 50, 0.5))',
      },
    },

    //
    // Tabs
    //

    BackstageHeaderTabs: {
      tabsWrapper: {
        backgroundColor: 'unset',
      },
      defaultTab: {
        color: 'var(--cds-alias-object-interaction-color)',
        fontSize: 'unset',
        fontWeight: 'var(--cds-global-typography-body-font-weight)' as any,
        marginRight: 'var(--cds-global-space-5)',
        padding:
          'var(--cds-global-space-5) var(--cds-global-space-6) var(--cds-global-space-4) var(--cds-global-space-6)',
        textTransform: 'unset',
      },
      selected: {
        color: 'var(--cds-alias-object-interaction-color)',
      },
      tabRoot: {
        '&:hover': {
          color: 'var(--cds-alias-object-interaction-color)',
          backgroundColor: 'unset',
        },
      },
    },

    MuiTabs: {
      root: {
        minHeight: 'unset',
      },
      flexContainer: {
        borderBottom: '1px solid var(--cds-alias-object-border-color)',
      },
      indicator: {
        backgroundColor:
          'var(--cds-alias-object-interaction-background-highlight)',
        height: '4px',
      },
    },

    MuiTab: {
      root: {
        fontSize: '100%',
        fontWeight: 'var(--cds-global-typography-body-font-weight)' as any,
        minHeight: 'var(--cds-alias-object-interaction-touch-target)',
        // Set '!important' to overcome the @media setting.
        // override of minWidth should be done in that @media.
        minWidth: 'unset !important',
        padding: '0 var(--cds-global-space-6)',
        textTransform: 'unset',

        '&:active': {
          background: 'var(--cds-alias-object-interaction-background-active)',
          color: 'var(--cds-alias-object-interaction-color-active)',
        },
        '&:focus-visible': {
          outline: 'var(--cds-alias-object-interaction-outline)',
          outlineOffset:
            'calc(var(--cds-alias-object-interaction-outline-offset) * -1)',
        },
      },
      textColorInherit: {
        opacity: 'unset',
      },
      wrapper: {
        whiteSpace: 'nowrap',
      },
    },

    //
    // Button
    //

    MuiButtonBase: {
      root: {
        '--border-width': 'var(--cds-alias-object-border-width-100, 0.0625rem)',
        '--font-size': 'var(--cds-global-typography-font-size-2, 0.75rem)',
        '--padding':
          'calc(var(--cds-global-space-6, 0.75rem) - var(--border-width))',
        '--height': 'var(--cds-global-space-11, 2.25rem)',
        '--min-width': 'var(--cds-global-space-13, 4rem)',
        '--font-weight':
          'var(--cds-global-typography-font-weight-semibold, 600)',
        '--font-family':
          'var(--cds-global-typography-font-family, "Clarity City", "Avenir Next", sans-serif)',
        '--letter-spacing': '0.12em',

        display: 'inline-flex',
        fontWeight: 'var(--font-weight)' as any,
        height: 'var(--height)',
        minWidth: 'var(--min-width)',

        '&:disabled': {
          cursor: 'not-allowed !important',
        },
      },
    },

    MuiButton: {
      root: {
        fontSize: 'var(--cds-global-typography-font-size-2, 0.75rem)',
        fontWeight: 'var(--font-weight)' as any,
        letterSpacing: '0.12em',
        lineHeight: '1em',
        padding: 'var(--padding)',
        textTransform: 'uppercase',

        '&:focus-visible': {
          outline: '1px dotted ButtonText',
        },
      },
      contained: {
        boxShadow: 'none',

        // MUI uses a class, instead of a pseudo element. Strange.
        '&.Mui-focusVisible': {
          boxShadow: 'none',
          outline: '1px dotted ButtonText',
        },

        '&:hover, &:active': {
          boxShadow: 'none',
        },
      },
      sizeSmall: {
        '--height': 'var(--cds-global-space-9)',
      },
      text: {
        padding: 'var(--padding)',
      },
      textSizeSmall: {
        fontSize: 'var(--cds-global-typography-font-size-2, 0.75rem)',
        padding:
          'var(--cds-global-space-4, 0.375rem) var(--cds-global-space-6, 0.75rem)',
      },
      outlined: {
        padding: 'var(--padding)',
      },
      outlinedSizeSmall: {
        '--padding':
          'var(--cds-global-space-4, 0.375rem) var(--cds-global-space-6, 0.75rem)',
        '--height':
          'calc(var(--cds-global-space-9, 1.5rem) + var(--cds-global-space-1, 0.0625rem))',

        fontSize: 'var(--font-size)',
        padding: 'var(--padding)',
      },
    },

    MuiIconButton: {
      root: {
        '--min-width': 0,
        '--padding':
          'calc(var(--cds-global-space-6, 0.75rem) - var(--border-width)) calc(var(--cds-global-space-6, 0.75rem) - var(--cds-global-space-2, 0.125rem) - var(--border-width))',

        borderStyle: 'solid',
        fontSize: 'var(--font-size)',
        padding: 'var(--padding)',
        width: 'var(--height)',
      },
      sizeSmall: {
        '--height': 'var(--cds-global-space-9)',
        '--padding':
          'var(--cds-global-space-4, 0.375rem) var(--cds-global-space-6, 0.75rem)',

        fontSize: 'var(--font-size)',
        padding: 'var(--padding)',
      },
    },

    MuiInputBase: {
      root: {
        lineHeight: 'inherit',
      },
      input: {
        height: 'unset',
      },
    },

    MuiOutlinedInput: {
      input: {
        padding: 'var(--cds-global-space-8)',
      },
    },

    //
    // Toggle Button Group
    //

    MuiToggleButtonGroup: {},

    MuiToggleButton: {
      root: {
        borderColor: 'var(--cds-alias-status-info)',
        borderRadius: 'var(--cds-alias-object-border-radius-100)',
        borderWidth: 'var(--cds-alias-object-border-width-100)',
        color: 'var(--cds-alias-status-info)',

        '&:hover': {
          backgroundColor:
            'var(--cds-alias-object-interaction-background-hover)',
        },
        '&$selected': {
          backgroundColor:
            'var(--cds-alias-object-interaction-background-selected)',
          color: 'var(--cds-alias-status-info)',
          '&:hover': {
            backgroundColor:
              'var(--cds-alias-object-interaction-background-hover)',
          },
        },
      },
      label: {
        fontWeight: 'var(--font-weight)' as any,
        letterSpacing: 'var(--letter-spacing)',
        lineHeight: '1em',
      },
      sizeSmall: {
        fontSize: 'var(--cds-global-typography-font-size-2, 0.75rem)',
      },
    },

    //
    // Chip
    //

    MuiChip: {
      root: {
        '--background-color':
          'var(--cds-alias-status-tint, var(--cds-alias-status-neutral-tint, var(--cds-global-color-construction-50, #f1f6f8)))',
        '--border-color':
          'var(--cds-alias-status-neutral, var(--cds-global-color-construction-600, #4f6169))',
        '--border-radius': 'var(--cds-alias-object-border-radius-200, 0.75rem)',
        '--border-width': 'var(--cds-alias-object-border-width-100, 0.0625rem)',
        '--color':
          'var(--cds-global-typography-color-400, var(--cds-global-color-construction-900, #21333b))',
        '--font-size': 'var(--cds-global-typography-font-size-0, 0.625rem)',
        '--font-weight':
          'var(--cds-global-typography-font-weight-regular, 400)',
        '--padding': 'var(--cds-global-space-2, 0.125rem)',
        '--size': 'var(--cds-global-space-7, 1rem)',

        backgroundColor: 'var(--background-color)',
        borderColor: 'var(--border-color)',
        borderRadius: 'var(--border-radius)',
        borderStyle: 'solid',
        borderWidth: 'var(--border-width)',
        color: 'var(--color)',
        fontSize: 'var(--font-size)',
        fontWeight: 'var(--font-weight)' as any,
        padding: '0 var(--padding)',

        height: '',
        lineHeight: 'unset',
      },
      clickable: {
        '--height': '', // override the MuiButtonBase-root `height`

        '&:hover': {
          '--background-color':
            'var(--cds-alias-object-interaction-background-hover)',
        },
        '&:focus': {
          '--background-color': theme.palette.background.paper,
        },
      },
      deleteIcon: {
        color: 'var(--color)',
        height: 'var(--cds-global-space-7, 1rem)',
        width: 'var(--cds-global-space-7, 1rem)',
      },
      outlined: {
        '--border-color': 'var(--cds-alias-status-neutral)',

        // invalidate properties we no longer want MUI to control
        border: '',
      },
      sizeSmall: {
        height: 'unset',
      },
    },

    MuiSelect: {
      root: {
        marginBottom: 0,
      },
    },

    BackstageSelectInputBase: {
      input: {
        padding: 'var(--cds-global-space-5)',
      },
    },

    BackstageDismissableBanner: {
      error: {
        backgroundColor: theme.palette.error.main,
      },
    },
    BackstageHeaderIconLinkRow: {
      links: {
        marginBottom: 0,
      },
    },

    //
    // Card
    //

    MuiCard: {
      root: {
        '--color': 'initial',
        '--background':
          'var(--cds-alias-object-container-background, var(--cds-global-color-white, white))',
        '--border':
          'var(--cds-alias-object-border-width-100, 0.0625rem) solid var(--cds-alias-object-container-border-color, var(--cds-global-color-construction-200, #cbd4d8))',
        '--border-radius': 'var(--cds-alias-object-border-radius-100, 0.25rem)',
        '--box-shadow':
          'var(--cds-alias-object-shadow-100, 0 calc(1 / var(--cds-global-base, 20) * 1rem) calc(3 / var(--cds-global-base, 20) * 1rem) 0 rgba(27, 43, 50, 0.5))',
        '--height': '100%',
        '--overflow': 'visible',
        '--overflow-x': 'visible',
        '--overflow-y': 'visible',
        '--padding': 'var(--cds-global-space-6) var(--cds-global-space-8)',
        '--width': '100%',

        background: 'var(--background)',
        border: 'var(--border)',
        borderRadius: 'var(--border-radius)',
        boxShadow: 'var(--box-shadow)',
      },
    },
    MuiCardActions: {
      root: {
        justifyContent: 'flex-start',
      },
    },
    MuiCardActionArea: {
      root: {
        '--height': 'unset',
      },
    },
    MuiCardHeader: {
      root: {
        padding: 'var(--cds-global-space-6) var(--cds-global-space-8)',
      },
      title: {
        color: 'var(--cds-global-typography-color-400)',
        marginTop: 0,
      },
    },
    MuiCardContent: {
      root: {
        color: 'var(--cds-global-typography-color-500)',
        padding: 'var(--cds-global-space-6) var(--cds-global-space-8)',
        '&:last-child': {
          paddingBottom: 'var(--cds-global-space-6)',
        },
      },
    },

    MuiDivider: {},

    MuiAlert: {
      root: {
        '--border-radius': 'var(--cds-alias-object-border-radius-100, 0.25rem)',
        '--color':
          'var(--cds-global-typography-color-400, var(--cds-global-color-construction-900, #21333b))',
        '--container-padding': 'var(--cds-global-space-2, 0.125rem) 0',
        '--font-size':
          'var(--cds-global-typography-secondary-font-size, 0.8125rem)',
        '--font-weight':
          'var(--cds-global-typography-secondary-font-weight, 400)',
        '--icon-size': 'var(--cds-global-space-8, 1.125rem)',
        '--icon-color': 'var(--color)',
        '--pager-background':
          'var(--cds-alias-status-neutral, var(--cds-global-color-construction-600, #4f6169))',

        color: 'var(--color)',
        backgroundColor:
          'var(--cds-alias-status-neutral-tint, var(--cds-global-color-construction-50, #f1f6f8))',
        borderColor:
          'var(--cds-alias-status-neutral, var(--cds-global-color-construction-600, #4f6169))',
        borderRadius: 'var(--border-radius)',
        borderStyle: 'solid',
        borderWidth: 'var(--cds-alias-object-border-width-100, 0.0625rem)',
        letterSpacing:
          'var(--cds-global-typography-body-letter-spacing, -0.014286em)',
        minHeight: 'var(--cds-global-space-9, 1.5rem)',
        padding:
          'var(--cds-global-space-5, 0.5rem) var(--cds-global-space-5, 0.5rem) var(--cds-global-space-4, 0.375rem) var(--cds-global-space-6, 0.75rem)',
      },
      // Brute force the 3 different types of MUI alerts to all match Clarity's
      // single style. We may decide to support different alert varients in the
      // future.
      // setting each of the overrides to a single definition would be really nice (e.g.: `standardError` = `filledError` = `outlinedError`: { ... })
      filledError: {
        '--background':
          'var(--cds-alias-status-danger, var(--cds-global-color-red-700, #e02200))',
        '--border-radius': 0,
        '--color':
          'var(--cds-global-typography-color-100, var(--cds-global-color-white, white))',

        backgroundColor: 'var(--background)',
        borderColor: 'var(--background)',
        color: 'var(--color)',
        fontWeight: 'var(--font-weight)' as any,

        '& $icon': {
          color: 'var(--icon-color)',
        },
      },
      filledInfo: {
        '--background':
          'var(--cds-alias-status-info, var(--cds-global-color-blue-700, #0079ad))',
        '--border-radius': 0,
        '--color':
          'var(--cds-global-typography-color-100, var(--cds-global-color-white, white))',

        backgroundColor: 'var(--background)',
        borderColor: 'var(--background)',
        color: 'var(--color)',
        fontWeight: 'var(--font-weight)' as any,
        '& $icon': {
          color: 'var(--icon-color)',
        },
      },
      filledSuccess: {
        '--background':
          'var(--cds-alias-status-success, var(--cds-global-color-green-700, #42810e))',
        '--border-radius': 0,
        '--color':
          'var(--cds-global-typography-color-100, var(--cds-global-color-white, white))',

        backgroundColor: 'var(--background)',
        borderColor: 'var(--background)',
        color: 'var(--color)',
        fontWeight: 'var(--font-weight)' as any,

        '& $icon': {
          color: 'var(--icon-color)',
        },
      },
      filledWarning: {
        '--background':
          'var(--cds-alias-status-warning, var(--cds-global-color-ochre-500, #ffb92e))',
        '--border-radius': 0,
        '--color': 'var(--cds-global-color-construction-900, #21333b)',

        backgroundColor: 'var(--background)',
        borderColor: 'var(--background)',
        color: 'var(--color)',

        '& $icon': {
          color: 'var(--icon-color)',
        },
      },
      outlinedError: {
        backgroundColor:
          'var(--cds-alias-status-danger-tint, var(--cds-global-color-red-50, #fff2f0))',
        borderColor:
          'var(--cds-alias-status-danger, var(--cds-global-color-red-700, #e02200))',

        '& $icon': {
          color: 'var(--icon-color)',
        },
      },
      outlinedInfo: {
        backgroundColor:
          'var(--cds-alias-status-info-tint, var(--cds-global-color-blue-50, #e6f7ff))',
        borderColor:
          'var(--cds-alias-status-info, var(--cds-global-color-blue-700, #0079ad))',

        '& $icon': {
          color: 'var(--icon-color)',
        },
      },
      outlinedSuccess: {
        backgroundColor:
          'var(--cds-alias-status-success-tint, var(--cds-global-color-green-50, #eefce3))',
        borderColor:
          'var(--cds-alias-status-success, var(--cds-global-color-green-700, #42810e))',

        '& $icon': {
          color: 'var(--icon-color)',
        },
      },
      outlinedWarning: {
        '--icon-color': 'var(--cds-global-color-construction-900, #21333b)',

        backgroundColor:
          'var(--cds-alias-status-warning-tint, var(--cds-global-color-ochre-100, #fff2d6))',
        borderColor:
          'var(--cds-alias-status-warning, var(--cds-global-color-ochre-500, #ffb92e))',
        color: 'var(--cds-global-color-construction-900, #21333b)',

        '& $icon': {
          color: 'var(--icon-color)',
        },
      },
      standardError: {
        backgroundColor:
          'var(--cds-alias-status-danger-tint, var(--cds-global-color-red-50, #fff2f0))',
        borderColor:
          'var(--cds-alias-status-danger, var(--cds-global-color-red-700, #e02200))',
        color:
          'var(--cds-global-typography-color-400, var(--cds-global-color-construction-900, #21333b))',

        '& $icon': {
          color: 'var(--icon-color)',
        },
      },
      standardInfo: {
        backgroundColor:
          'var(--cds-alias-status-info-tint, var(--cds-global-color-blue-50, #e6f7ff))',
        borderColor:
          'var(--cds-alias-status-info, var(--cds-global-color-blue-700, #0079ad))',
        color:
          'var(--cds-global-typography-color-400, var(--cds-global-color-construction-900, #21333b))',

        '& $icon': {
          color: 'var(--icon-color)',
        },
      },
      standardSuccess: {
        backgroundColor:
          'var(--cds-alias-status-success-tint, var(--cds-global-color-green-50, #eefce3))',
        borderColor:
          'var(--cds-alias-status-success, var(--cds-global-color-green-700, #42810e))',
        color:
          'var(--cds-global-typography-color-400, var(--cds-global-color-construction-900, #21333b))',

        '& $icon': {
          color: 'var(--icon-color)',
        },
      },
      standardWarning: {
        '--icon-color': 'var(--cds-global-color-construction-900, #21333b)',

        backgroundColor:
          'var(--cds-alias-status-warning-tint, var(--cds-global-color-ochre-100, #fff2d6))',
        borderColor:
          'var(--cds-alias-status-warning, var(--cds-global-color-ochre-500, #ffb92e))',
        color: 'var(--cds-global-color-construction-900, #21333b)',

        '& $icon': {
          color: 'var(--icon-color)',
        },
      },
      action: {
        '--action-size':
          'calc(var(--min-height) - var(--cds-global-space-4, 0.375rem))',
        '--action-text-color': 'var(--color)',
        '--action-font-size':
          'var(--cds-global-typography-font-size-3, 0.8125rem)',

        marginRight: 'unset',
        paddingLeft: 'var(--cds-global-layout-space-md, 1rem)',
        whiteSpace: 'nowrap',

        '& .MuiButton-text': {
          '--color': 'var(--action-text-color)',

          fontSize: 'var(--action-font-size)',
          // height: 'var(--action-size)',
          height: 'var(--cds-global-space-9)', // setting equal to sizeSmall button
          letterSpacing: 'normal',
          padding:
            'var(--cds-global-space-4, 0.375rem) var(--cds-global-space-6, 0.75rem)', // setting equal to sizeSmall button
          textDecoration: 'underline',
          textTransform: 'none',

          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
      icon: {
        color: 'var(--icon-color)',
        height: 'var(--icon-size)',
        width: 'var(--icon-size)',

        padding: 0,
        fontSize: 'var(--icon-size)',
      },
      message: {
        alignItems: 'center',
        fontSize: 'var(--font-size)',
        fontWeight: 'var(--font-weight)' as any,
        letterSpacing: 'var(--letter-spacing)',
        lineHeight: 'var(--cds-global-typography-body-line-height, 1.42857em)',
        padding: 0,
      },
    },

    MuiSvgIcon: {
      root: {
        color: 'currentColor',
        contain: 'strict',
        cursor: 'inherit',
        fill: 'currentColor',
        fontSize: 'var(--cds-global-space-9)',
        verticalAlign: 'middle',
      },
      fontSizeSmall: {
        fontSize: 'var(--cds-global-space-7)',
      },
      fontSizeLarge: {
        fontSize: 'var(--cds-global-space-11)',
      },
    },

    //
    // Switch
    //

    MuiSwitch: {
      switchBase: {
        width: 'auto',
      },
    },

    PluginCatalogSystemDiagramCard: {
      domainNode: {
        fill: theme.palette.secondary.main,
      },
      systemNode: {
        fill: theme.palette.primary.main,
      },
      componentNode: {
        fill: theme.palette.success.main,
      },
      apiNode: {
        fill: theme.palette.warning.main,
      },
      resourceNode: {
        fill: theme.palette.grey[800],
      },
    },
  };
};

export const createOverrides = (theme: BackstageTheme): Overrides => {
  return Object.assign(
    {},
    createBackstageOverrides(theme),
    createClarityOverrides(theme),
  );
};
