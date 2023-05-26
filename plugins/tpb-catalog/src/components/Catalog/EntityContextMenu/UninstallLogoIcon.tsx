import React from 'react';
import {
  StandardProps,
  StyleRulesCallback,
  Theme,
  withStyles,
} from '@material-ui/core';
import { BackstageTheme } from '@backstage/theme';

export type LogoIconClassKey = 'root' | 'svg';

export interface LogoIconProps
  extends StandardProps<
    React.HTMLAttributes<HTMLOrSVGElement>,
    LogoIconClassKey
  > {}

const styles: StyleRulesCallback<
  BackstageTheme,
  LogoIconProps,
  LogoIconClassKey
> = (_: BackstageTheme) => ({
  root: {
    display: 'flex',
    width: '1.8rem',
    height: '1.8rem',
    marginRight: '10px',
  },
  svg: {
    width: '100%',
    height: '100%',
  },
});

// Stolen directly from a live Tanzu site using the Web Inspector
const UninstallLogoIcon = (props: LogoIconProps) => {
  return (
    <span className={props.classes?.root}>
      <svg
        viewBox="0 0 36 36"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M11.29,26.72a1,1,0,0,0,1.41,0L18,21.49l5.3,5.23A1,1,0,0,0,24.7,25.3l-5.28-5.21,5.28-5.21a1,1,0,0,0-1.41-1.42L18,18.68l-5.3-5.23a1,1,0,0,0-1.41,1.42l5.28,5.21L11.3,25.3A1,1,0,0,0,11.29,26.72Z"
        />
        <path
          fill="currentColor"
          d="M30.92,8H26.55a1,1,0,0,0,0,2H31V30H5V10H9.38a1,1,0,0,0,0-2H5.08A2,2,0,0,0,3,10V30a2,2,0,0,0,2.08,2H30.92A2,2,0,0,0,33,30V10A2,2,0,0,0,30.92,8Z"
        />
      </svg>
    </span>
  );
};

export default withStyles<LogoIconClassKey>(
  styles as StyleRulesCallback<Theme, LogoIconProps, LogoIconClassKey>,
  { name: 'ClarityLogoIcon' },
)(UninstallLogoIcon);
