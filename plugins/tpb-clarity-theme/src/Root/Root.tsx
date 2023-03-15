/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { PropsWithChildren, useRef } from 'react';
import {
  Button,
  StandardProps,
  StyleRulesCallback,
  Theme,
  withStyles,
} from '@material-ui/core';
import { Settings as SidebarSettings } from '@backstage/plugin-user-settings';
import { SidebarItemSurface } from '@tpb/core';
import { ClaritySidebarPage } from '../Sidebar/SidebarPage';
import { ClaritySidebar } from '../Sidebar/Sidebar';
import { BackstageTheme } from '@backstage/theme';
import './styles.css';
import { ClarityHeader } from '../Header/Header';

interface IRoot
  extends StandardProps<React.HTMLAttributes<HTMLDivElement>, RootClassKey> {
  sidebar: SidebarItemSurface;
}

const Root = ({ sidebar, children, classes }: PropsWithChildren<IRoot>) => {
  const skipToContentRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className={classes?.root}>
      <div ref={skipToContentRef} className="skip-to-content">
        <Button
          variant="contained"
          className="skip-button"
          onClick={() => contentRef.current?.focus({ preventScroll: true })}
        >
          Go to content
        </Button>
      </div>
      <ClarityHeader />
      <ClaritySidebarPage>
        <ClaritySidebar>
          {...sidebar.topItems}
          {...sidebar.mainItems}
          <SidebarSettings />
        </ClaritySidebar>
        {/* eslint-disable */}
        <div
          className={classes?.content}
          ref={contentRef}
          tabIndex={0}
          data-testid="root-content"
        >
          {children}
        </div>
      </ClaritySidebarPage>
    </div>
  );
};

export type RootClassKey = 'root' | 'content';

export interface RootProps
  extends StandardProps<React.HTMLAttributes<HTMLDivElement>, RootClassKey> {}

const styles: StyleRulesCallback<BackstageTheme, RootProps, RootClassKey> = (
  _: BackstageTheme,
) => ({
  root: {},
  content: {
    width: '100%',
    '& > div:first-child': {
      height: 'calc(100vh - 69.5px)',
    },
    '& header': {
      boxShadow: 'none',
    },
  },
});

export const ClarityRoot = withStyles<RootClassKey>(
  styles as StyleRulesCallback<Theme, RootProps, RootClassKey>,
  { name: 'ClarityRoot' },
)(Root);
