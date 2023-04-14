import React, { PropsWithChildren } from 'react';
import clsx from 'clsx';
import {
  StandardProps,
  StyleRulesCallback,
  Theme,
  withStyles,
} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { SidebarContext } from '@backstage/core-components';
import { BackstageTheme } from '@backstage/theme';

import AngleDoubleLineIcon from './AngleDoubleLineIcon';
import LogoIcon from '../Header/LogoIcon';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

export type SidebarClassKey =
  | 'root'
  | 'collapseButton'
  | 'collapseButtonOpen'
  | 'sidebarBottom'
  | 'tap'
  | 'logo';

export interface SidebarProps
  extends StandardProps<
    React.HTMLAttributes<HTMLDivElement>,
    SidebarClassKey
  > {}

enum State {
  Open,
  Closed,
}

const styles: StyleRulesCallback<
  BackstageTheme,
  SidebarProps,
  SidebarClassKey
> = (theme: BackstageTheme) => ({
  root: {
    backgroundColor: theme.palette.navigation.background,
    color: theme.palette.navigation.color,
    display: 'flex',
    flexDirection: 'column',
    // paddingTop: '0.9rem',
  },
  collapseButton: {
    '--line-height':
      'var(--cds-alias-object-interaction-touch-target, 2.25rem)',
    '--padding': '0 var(--cds-global-space-5, 0.5rem)',

    borderBottom: `1px solid ${theme.palette.navigation.color}`,
    cursor: 'pointer',
    display: 'flex',
    // justifyContent: 'center',
    lineHeight: 'var(--line-height)',
    // marginBottom: theme.spacing(2),
    minHeight: 'var(--line-height)',
    padding: 'var(--padding)',
    width: '100%',

    '& svg': {
      transform: 'rotate(90deg)',
    },
  },
  collapseButtonOpen: {
    justifyContent: 'flex-end',

    '& svg': {
      transform: 'rotate(270deg)',
    },
  },
  sidebarBottom: {
    marginTop: 'auto',
  },
  tap: {
    display: 'flex',
    paddingBottom: 'var(--cds-global-space-4)',
    paddingLeft: 'var(--cds-global-space-4)',
    height: 70,
    alignItems: 'center',
    lineHeight: '18px',
  },
  logo: {
    '--size': '1.6rem',
    width: 'var(--size)',
    height: 'var(--size)',
  },
});

const Sidebar = (props: PropsWithChildren<SidebarProps>) => {
  const config = useApi(configApiRef);
  const icon = config.getOptionalString('customize.custom_logo');
  const text = config.getOptionalString('customize.custom_name');

  const [state, setState] = React.useState(State.Closed);

  const isSmallScreen = useMediaQuery<BackstageTheme>(theme =>
    theme.breakpoints.down('md'),
  );

  const toggleOpenState = () => {
    setState(state === State.Open ? State.Closed : State.Open);
  };

  const onFocus = (event: React.FocusEvent<HTMLSpanElement>) =>
    event.stopPropagation();

  const onKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (event.key.toLowerCase() === 'enter') {
      toggleOpenState();
    }
  };

  const setOpen = (open: boolean) => { setState(open ? State.Open : State.Closed) }

  const isOpen = state === State.Open && !isSmallScreen;
  const HasTapLogo = icon && text;

  return (
    <SidebarContext.Provider value={{ isOpen, setOpen }}>
      <div className={props.classes?.root}>
        {!isSmallScreen && (
          <span
            role="button"
            tabIndex={0}
            onClick={toggleOpenState}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            className={clsx(props.classes?.collapseButton, {
              ...(props.classes?.collapseButtonOpen && {
                [props.classes?.collapseButtonOpen]: isOpen,
              }),
            })}
          >
            <AngleDoubleLineIcon />
          </span>
        )}
        {props.children}
        {HasTapLogo && (
          <div className={props.classes?.sidebarBottom}>
            <div className={props.classes?.tap}>
              <LogoIcon classes={{ root: props.classes?.logo }} />
              {!state && (
                <span>
                  VMware Tanzu <br />
                  Application Platform
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </SidebarContext.Provider>
  );
};

export const ClaritySidebar = withStyles<SidebarClassKey>(
  styles as StyleRulesCallback<Theme, SidebarProps, SidebarClassKey>,
  { name: 'ClaritySidebar' },
)(Sidebar);
