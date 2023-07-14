import {
  AppPluginInterface,
  AppPluginSurface,
  SurfaceStoreInterface,
} from '@tpb/core-frontend';
import { HomeSurface } from '@tpb/plugin-home';
import React from 'react';
import {
  HomePageStackOverflowQuestions,
  stackOverflowPlugin,
} from '@backstage/plugin-stack-overflow';

export const StackOverflowPlugin: AppPluginInterface =
  () => (context: SurfaceStoreInterface) => {
    context.applyTo(AppPluginSurface, appPluginSurface => {
      appPluginSurface.add(stackOverflowPlugin);
    });

    context.applyTo(HomeSurface, homeSurface => {
      homeSurface.addWidget(
        <HomePageStackOverflowQuestions
          requestParams={{
            tagged: 'backstage',
            site: 'stackoverflow',
            pagesize: 5,
          }}
        />,
        {
          component: 'HomePageStackOverflowQuestions',
          width: 6,
          height: 12,
          x: 0,
          y: 30,
        },
      );
    });
  };
