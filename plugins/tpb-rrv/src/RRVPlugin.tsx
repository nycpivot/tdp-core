import React from 'react';
import { AppPluginInterface, AppRouteSurface } from '@tpb/core';
import { WorkloadsContent } from '@tpb/rrv';
import { EntityLayout } from '@backstage/plugin-catalog';
import { EntityPageSurface } from '@tpb/plugin-catalog';

export const RRVPlugin: AppPluginInterface = () => context => {
  context.applyWithDependency(
    AppRouteSurface,
    EntityPageSurface,
    // @ts-ignore routes that is not used
    (routes, surface) => {
      surface.servicePage.addTab(
        <EntityLayout.Route path="/workloads" title="Runtime Resources">
          <WorkloadsContent />
        </EntityLayout.Route>,
      );
    },
  );
};
