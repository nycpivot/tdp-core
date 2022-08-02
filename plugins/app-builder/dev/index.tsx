import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { appBuilderPlugin, AppBuilderPage } from '../src/plugin';

createDevApp()
  .registerPlugin(appBuilderPlugin)
  .addPage({
    element: <AppBuilderPage />,
    title: 'Root Page',
    path: '/app-builder'
  })
  .render();
