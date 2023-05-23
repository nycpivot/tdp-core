/**
 * There is duplication between the LogoIcon fil and this one.
 * I will soon create an Icon component to hold the duplicated
 * logic
 */
import React from 'react';

import {
  StandardProps,
  StyleRulesCallback,
  Theme,
  withStyles,
} from '@material-ui/core';
import { BackstageTheme } from '@backstage/theme';

export type AngleDoubleLineIconClassKey = 'root' | 'svg';

export interface AngleDoubleLineIconProps
  extends StandardProps<
    React.HTMLAttributes<HTMLOrSVGElement>,
    AngleDoubleLineIconClassKey
  > {}

const styles: StyleRulesCallback<
  BackstageTheme,
  AngleDoubleLineIconProps,
  AngleDoubleLineIconClassKey
> = (_: BackstageTheme) => ({
  root: {
    width: 'var(--cds-global-space-7, 0.8rem)',
    height: 'var(--cds-global-space-7, 0.8rem)',
  },
  svg: {
    width: '100%',
    height: '100%',
  },
});

const AngleDoubleLineIcon = (props: AngleDoubleLineIconProps) => {
  /**
   * For now I'm just taking this svg from the assets in
   * https://clarity.design/get-started/design/
   *
   * Ideally we would have an icons package to consume.
   */
  return (
    <span className={props.classes?.root}>
      <svg
        version="1.1"
        viewBox="0 0 36 36"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>angle-double-line</title>
        <path
          fill="currentColor"
          d="M29,19.41a1,1,0,0,1-.71-.29L18,8.83,7.71,19.12a1,1,0,0,1-1.41-1.41L18,6,29.71,17.71A1,1,0,0,1,29,19.41Z"
        />
        <path
          fill="currentColor"
          d="M29,30.41a1,1,0,0,1-.71-.29L18,19.83,7.71,30.12a1,1,0,0,1-1.41-1.41L18,17,29.71,28.71A1,1,0,0,1,29,30.41Z"
        />
        <rect
          fill="currentColor"
          x="0"
          y="0"
          width="36"
          height="36"
          fillOpacity="0"
        />
      </svg>
    </span>
  );
};

export default withStyles<AngleDoubleLineIconClassKey>(
  styles as StyleRulesCallback<
    Theme,
    AngleDoubleLineIconProps,
    AngleDoubleLineIconClassKey
  >,
  { name: 'AngleDoubleLineIcon' },
)(AngleDoubleLineIcon);
