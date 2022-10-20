import React from 'react';
import { Route } from 'react-router';
import { SidebarItem } from '@backstage/core-components';
import { AppPluginInterface } from '@esback/core';
import AlarmIcon from '@material-ui/icons/Alarm';

export const HelloWorldPlugin: AppPluginInterface = () => {
  return {
    routes: surface =>
      surface.add(
        <Route path="/hello-world" element={<h1>Hello World!!</h1>} />,
      ),
    sidebarItems: surface =>
      surface.add(
        <SidebarItem icon={AlarmIcon} to="hello-world" text="Hello" />,
      ),
  };
};
