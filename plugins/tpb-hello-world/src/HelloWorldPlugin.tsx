import React from 'react';
import { Route } from 'react-router';
import { SidebarItem } from '@backstage/core-components';
import {
  AppPluginInterface,
  AppRouteSurface,
  SidebarItemSurface,
  SettingsTabsSurface,
  BannerSurface,
} from '@tpb/core';
import { SettingsLayout } from '@backstage/plugin-user-settings';
import AlarmIcon from '@material-ui/icons/Alarm';
import { HelloWorld } from './HelloWorld';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

export interface ToggleFeatureProps {
  feature: string;
}

export const ToggleFeature: React.FunctionComponent<
  ToggleFeatureProps
> = props => {
  const config = useApi(configApiRef);
  const configVal = config.getOptionalBoolean(props.feature);
  const isFeatureEnabled = configVal ?? true;
  return isFeatureEnabled ? <>{props.children}</> : null;
};

export const HelloWorldPlugin: AppPluginInterface = () => context => {
  context.applyTo(AppRouteSurface, routes =>
    routes.add(<Route path="/hello-world" element={<HelloWorld />} />),
  );

  context.applyTo(SidebarItemSurface, sidebar =>
    sidebar.addMainItem(
      <SidebarItem icon={AlarmIcon} to="hello-world" text="Hello" />,
    ),
  );

  context.applyTo(SettingsTabsSurface, tabs =>
    tabs.add(
      <SettingsLayout.Route path="/hello-world" title="Hello World Tab">
        <div>Hello World Settings Tab Content</div>
      </SettingsLayout.Route>,
    ),
  );

  context.applyTo(BannerSurface, banners => {
    banners.add(
      <ToggleFeature feature="helloWorld.enabled">
        <div>Hello World Banner</div>
      </ToggleFeature>,
    );
  });
};
