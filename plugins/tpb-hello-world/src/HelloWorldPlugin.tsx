import React from 'react';
import { Route } from 'react-router';
import { SidebarItem } from '@backstage/core-components';
import {
  AppPluginInterface,
  AppRouteSurface,
  SidebarItemSurface,
  SettingsTabsSurface,
  BannerSurface,
} from '@tpb/core-frontend';
import { SettingsLayout } from '@backstage/plugin-user-settings';
import AlarmIcon from '@material-ui/icons/Alarm';
import { HelloWorld } from './HelloWorld';
import { EntityPageSurface } from '@tpb/plugin-catalog';
import { Grid } from '@material-ui/core';

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
    banners.add(<div>Hello World Banner</div>);
  });

  context.applyTo(EntityPageSurface, surface => {
    surface.apiPage.addOverviewContent(
      <Grid item md={6} xs={12}>
        <div>I am an Hello World overview!</div>
      </Grid>,
    );
  });
};
