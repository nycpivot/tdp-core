import React, { PropsWithChildren, useRef } from 'react';
import {
  StandardProps,
  StyleRulesCallback,
  Theme,
  withStyles,
  Button,
} from '@material-ui/core';
import { ClaritySidebar } from '../Sidebar/Sidebar';
import { ClaritySidebarPage } from '../Sidebar/SidebarPage';
import { BackstageTheme } from '@backstage/theme';
import './styles.css';
import { Banner } from '../Header/Banner';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { SidebarItemSurface } from '@tpb/core-frontend';
import { ToggleFeature } from '@tpb/feature-flags';
import { Settings as SidebarSettings } from '@backstage/plugin-user-settings';
import { SidebarItem } from '@backstage/core-components';
import Extension from '@material-ui/icons/Extension';
import HomeIcon from '@material-ui/icons/Home';
import AlarmIcon from '@material-ui/icons/Alarm';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import { SecurityAnalysisIcon } from "@tpb/plugin-security-analysis-frontend";
import { SupplyChainIcon } from "@tpb/plugin-supply-chain";

export type RootClassKey = 'root' | 'content' | 'contentSm';
import { ClarityHeader } from '../Header/Header';

export interface RootProps
  extends StandardProps<React.HTMLAttributes<HTMLDivElement>, RootClassKey> {}

interface IRoot
  extends StandardProps<React.HTMLAttributes<HTMLDivElement>, RootClassKey> {
  sidebar: SidebarItemSurface;
}

const styles: StyleRulesCallback<BackstageTheme, RootProps, RootClassKey> = (
  _: BackstageTheme,
) => ({
  root: {},
  content: {
    width: '100%',
    '& > :first-child': {
      height: 'calc(100vh - 69.5px)',
    },
    '& header': {
      boxShadow: 'none',
    },
  },
  contentSm: {
    '& > :first-child': {
      height: 'calc(100vh - 69.5px - 72px)',
    },
  },
});

const Root = ({ sidebar, classes, children }: PropsWithChildren<IRoot>) => {
  const config = useApi(configApiRef);
  const banner = {
    text: config.getOptionalString('customize.banners.text'),
    color: config.getOptionalString('customize.banners.color'),
    link: config.getOptionalString('customize.banners.link'),
    linkText: config.getOptionalString('customize.banners.linkText'),
    bg: config.getOptionalString('customize.banners.bg'),
  };

  let contentStyle;
  if (banner.text) {
    contentStyle = classes?.contentSm;
  }

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
      <Banner value={banner} />
      <ClarityHeader />
      <ClaritySidebarPage>
        <ClaritySidebar>
          {...sidebar.topItems}
          {/*{...sidebar.mainItems}*/}
          <ToggleFeature feature="customize.features.catalog.showInSidebar">
            <SidebarItem icon={HomeIcon} to="catalog" text="Home"/>
          </ToggleFeature>
          <ToggleFeature feature="customize.features.docs.showInSidebar">
            <SidebarItem icon={LibraryBooks} to="docs" text="Docs" />
          </ToggleFeature>
          <ToggleFeature feature="customize.features.appAccelerator.showInSidebar">
            <SidebarItem icon={AddCircleOutline} to="create" text="Create" />
          </ToggleFeature>
          <ToggleFeature feature="customize.features.appLiveView.showInSidebar">
            <SidebarItem icon={AccountTreeIcon} to="app-live-view" text="App Live View" />
          </ToggleFeature>
          <ToggleFeature feature="customize.features.apiDocs.showInSidebar">
            <SidebarItem icon={Extension} to="api-docs" text="APIs" />
          </ToggleFeature>
          <ToggleFeature feature="customize.features.supplyChain.showInSidebar">
            <SidebarItem icon={SupplyChainIcon} to="supply-chain" text="Supply Chain" />
          </ToggleFeature>
          <ToggleFeature feature="customize.features.securityAnalysis.showInSidebar">
            <SidebarItem icon={SecurityAnalysisIcon} to="security-analysis" text="Security Analysis" />
          </ToggleFeature>
          <ToggleFeature feature="customize.features.helloWorld.showInSidebar">
            <SidebarItem icon={AlarmIcon} to="hello-world" text="Hello" />
          </ToggleFeature>
          <ToggleFeature feature="customize.features.settings.showInSidebar">
            <SidebarSettings />
          </ToggleFeature>
        </ClaritySidebar>
        {/* eslint-disable */}
        <div
          className={`${classes?.content} ${contentStyle}`}
          ref={contentRef}
          tabIndex={0}
          data-testid="root-content"
        >
          {children}
        </div>
      </ClaritySidebarPage>
      <Banner value={banner} />
    </div>
  );
};

export const ClarityRoot = withStyles<RootClassKey>(
  styles as StyleRulesCallback<Theme, RootProps, RootClassKey>,
  { name: 'ClarityRoot' },
)(Root);
