import React from 'react';
import { AppPluginInterface, AppRouteSurface } from '@tpb/core-frontend';
import { WorkloadsContent } from '@tpb/rrv';
import { EntityLayout } from '@backstage/plugin-catalog';
import { EntityPageSurface } from '@tpb/plugin-catalog';

export const RRVPlugin: AppPluginInterface = () => context => {
  context.applyWithDependency(
    AppRouteSurface,
    EntityPageSurface,
    (_, surface) => {
      surface.servicePage.addTab(
        <EntityLayout.Route path="/workloads" title="Runtime Resources">
          <WorkloadsContent />
        </EntityLayout.Route>,
      );
    },
  );
};
