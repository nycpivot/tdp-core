import React from 'react';
import { Route } from 'react-router';
import { SidebarItem } from '@backstage/core-components';
import {
  AppPluginInterface,
  AppRouteSurface,
  SidebarItemSurface,
  SettingsTabsSurface,
} from '@tpb/core';
import { SettingsLayout } from '@backstage/plugin-user-settings';
import AlarmIcon from '@material-ui/icons/Alarm';
import { HelloWorld } from './HelloWorld';

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
};
