import { EntityLayout } from '@backstage/plugin-catalog';
import { EntityGithubActionsContent } from '@backstage/plugin-github-actions';
import { AppPluginInterface, AppRouteSurface } from '@tpb/core-frontend';
import { EntityPageSurface } from '@tpb/plugin-catalog';
import React from 'react';

export const GithubActionsPlugin: AppPluginInterface = () => context => {
  context.applyWithDependency(
    AppRouteSurface,
    EntityPageSurface,
    (_, surface) => {
      surface.servicePage.addTab(
        <EntityLayout.Route path="/github-actions" title="GitHub Actions">
          <EntityGithubActionsContent />
        </EntityLayout.Route>,
      );
    },
  );
};
