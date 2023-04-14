import React, { PropsWithChildren } from 'react';
import {
  StandardProps,
  StyleRulesCallback,
  Theme,
  withStyles,
} from '@material-ui/core';
import clsx from 'clsx';
import { BackstageTheme } from '@backstage/theme';
import { WithStylesOptions } from '@material-ui/core/styles/withStyles';

export type SidebarPageClassKey = 'root';

export interface SidebarPageProps
  extends StandardProps<
    React.HTMLAttributes<HTMLDivElement>,
    SidebarPageClassKey
  > {}

const styles: StyleRulesCallback<
  BackstageTheme,
  SidebarPageProps,
  SidebarPageClassKey
> = (_: BackstageTheme) => ({
  root: {
    display: 'flex',
    width: '100%',
  },
});

const SidebarPage = (props: PropsWithChildren<SidebarPageProps>) => {
  return <div className={clsx(props.classes?.root)}>{props.children}</div>;
};

export const ClaritySidebarPage = withStyles<
  SidebarPageClassKey,
  WithStylesOptions<BackstageTheme>,
  SidebarPageProps
>(styles as StyleRulesCallback<Theme, SidebarPageProps, SidebarPageClassKey>, {
  name: 'ClaritySidebarPage',
})(SidebarPage);
