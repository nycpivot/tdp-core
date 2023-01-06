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
// TODO: Figure out how to source this
const LogoIcon = (props: LogoIconProps) => {
  return (
    <span className={props.classes?.root}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 58.86">
        <g>
          <g>
            <path
              d="M39.3,52.67H21a2.35,2.35,0,0,1-1.86-.89L7.52,37.24a2.38,2.38,0,0,1-.45-2.06l4.42-17.8a2.42,2.42,0,0,1,1.25-1.56L29.12,7.61a2.39,2.39,0,0,1,2.12,0l16.59,8.22a2.34,2.34,0,0,1,1.26,1.58l4.22,17.8a2.38,2.38,0,0,1-.46,2L41.15,51.79A2.37,2.37,0,0,1,39.3,52.67ZM21,50.22H39.26L50.91,35.73,46.71,18,30.19,9.82,13.87,18,9.46,35.74Z"
              fill="#238fcf"
            />
            <g>
              <polygon
                points="51.22 12.55 53.3 10.84 31.41 0 31.41 2.74 51.22 12.55"
                fill="#1bbfd3"
              />
              <polygon
                points="3.2 38.02 0.53 38.61 15.8 57.77 17 55.34 3.2 38.02"
                fill="#79bf43"
              />
              <polygon
                points="28.95 2.75 28.95 0.01 7.35 10.84 9.37 12.58 28.95 2.75"
                fill="#1bbfd3"
              />
              <polygon
                points="7.91 14.56 5.83 12.77 0 36.21 2.68 35.62 7.91 14.56"
                fill="#1d4489"
              />
              <polygon
                points="57.71 35.63 60.38 36.22 54.83 12.77 52.71 14.51 57.71 35.63"
                fill="#1d4489"
              />
              <polygon
                points="57.16 38.02 43.21 55.37 44.4 57.8 59.83 38.61 57.16 38.02"
                fill="#79bf43"
              />
              <polygon
                points="19.21 56.4 18.01 58.86 42.18 58.86 40.98 56.4 19.21 56.4"
                fill="#1bbfd3"
              />
            </g>
          </g>
        </g>
      </svg>
    </span>
  );
};

export default withStyles<LogoIconClassKey>(
  styles as StyleRulesCallback<Theme, LogoIconProps, LogoIconClassKey>,
  { name: 'ClarityLogoIcon' },
)(LogoIcon);
