import React from 'react';
import { Route } from 'react-router';
import { SidebarItem } from '@backstage/core-components';
import {
  AppPluginInterface,
  AppRouteSurface,
  SidebarItemSurface,
} from '@esback/core';
import AlarmIcon from '@material-ui/icons/Alarm';

export const HelloWorldPlugin: AppPluginInterface = () => context => {
  context.applyTo(AppRouteSurface, routes =>
    routes.add(<Route path="/hello-world" element={<h1>Hello World!!</h1>} />),
  );

  context.applyTo(SidebarItemSurface, sidebar =>
    sidebar.addMainItem(
      <SidebarItem icon={AlarmIcon} to="hello-world" text="Hello" />,
    ),
  );
};
