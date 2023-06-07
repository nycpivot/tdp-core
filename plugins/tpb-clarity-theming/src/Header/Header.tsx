/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  StandardProps,
  StyleRulesCallback,
  Theme,
  withStyles,
} from '@material-ui/core';
import { BackstageTheme } from '@backstage/theme';
import LogoIcon from './LogoIcon';
import WhitelabelIcon from './WhitelabelIcon';
import { getTapUIKitPalette } from '../palette';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

export type HeaderClassKey = 'root' | 'header' | 'headerBold' | 'homeButton';

export interface HeaderProps
  extends StandardProps<React.HTMLAttributes<HTMLDivElement>, HeaderClassKey> {}

const styles: StyleRulesCallback<
  BackstageTheme,
  HeaderProps,
  HeaderClassKey
> = (theme: BackstageTheme) => ({
  root: {
    display: 'flex',
    flexBasis: 'auto',
    alignItems: 'center',
    padding: '12px 24px',
    minWidth: '200px',
    color: theme.palette.common.white,
    background: getTapUIKitPalette(theme.palette.type).headerBackground,
  },
  headerBold: {
    display: 'flex',
    fontWeight: 700,
    fontSize: theme.typography.h5.fontSize,
    lineHeight: theme.typography.h5.lineHeight,
  },
  header: {
    display: 'flex',
    fontWeight: theme.typography.h5.fontWeight,
    fontSize: theme.typography.h5.fontSize,
    lineHeight: theme.typography.h5.lineHeight,
    marginRight: '10px',
  },
  homeButton: {
    cursor: 'pointer',
  },
});

const Header = (props: HeaderProps) => {
  const config = useApi(configApiRef);
  const customLogo = config.getOptionalString('customize.custom_logo');
  const customName = config.getOptionalString('customize.custom_name');

  return (
    <div className={props.classes?.root}>
      <OptionallyCustomizedIcon
        className={props.classes?.homeButton}
        icon={customLogo}
      />
      <h1 className={props.classes?.header}>{customName ?? DEFAULT_TEXT}</h1>
    </div>
  );
};

export const ClarityHeader = withStyles<HeaderClassKey>(
  styles as StyleRulesCallback<Theme, HeaderProps, HeaderClassKey>,
  { name: 'ClarityHeader' },
)(Header);

type OptionallyCustomizedIconProps = {
  icon?: string;
  className?: string;
};

const DEFAULT_TEXT = 'VMware Tanzu Application Platform';

const OptionallyCustomizedIcon = ({
  icon,
  className,
}: OptionallyCustomizedIconProps): React.ReactElement => {
  const navigate = useNavigate();
  const navigateHome = () => navigate('/');
  if (icon) {
    return (
      <WhitelabelIcon
        alt="Company Logo"
        navigateHome={navigateHome}
        base64PNG={icon}
      />
    );
  }

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={navigateHome}
      onKeyDown={navigateHome}
      className={className}
    >
      <LogoIcon />
    </span>
  );
};
