import React from 'react';
import { AppPluginInterface, AppRouteSurface } from '@esback/core';
import { WorkloadsContent } from '@esback/rrv';
import { EntityLayout } from '@backstage/plugin-catalog';
import { EntityPageSurface } from '@esback/plugin-catalog';

export const RRVPlugin: AppPluginInterface = () => context => {
  context.applyWithDependency(
    AppRouteSurface,
    EntityPageSurface,
    // @ts-ignore routes that is not used
    (routes, surface) => {
      surface.addServicePageTab(
        <EntityLayout.Route path="/workloads" title="Runtime Resources">
          <WorkloadsContent />
        </EntityLayout.Route>,
      );
    },
  );
};
