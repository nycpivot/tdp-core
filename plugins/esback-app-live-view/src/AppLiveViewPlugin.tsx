import React from 'react';
import { AppPluginInterface, AppRouteSurface } from '@esback/core';
import { Route } from 'react-router';
import { AppLiveViewPage } from '@esback/app-live-view';

export const AppLiveViewPlugin: AppPluginInterface = () => context => {
  context.applyTo(AppRouteSurface, surface => {
    surface.add(<Route path="/app-live-view" element={<AppLiveViewPage />} />);
  });
};
