import React from 'react';
import { AppPluginInterface, AppRouteSurface } from '@esback/core';
import { EntityLayout, EntitySwitch } from '@backstage/plugin-catalog';
import { EntityPageSurface } from '@esback/plugin-catalog';
import {
  isGitlabAvailable,
  EntityGitlabContent,
  EntityGitlabLanguageCard,
  EntityGitlabContributorsCard,
  EntityGitlabMergeRequestsTable,
  EntityGitlabMergeRequestStatsCard,
  EntityGitlabPipelinesTable,
} from '@loblaw/backstage-plugin-gitlab';
import { Grid } from '@material-ui/core';

export const GitlabPlugin: AppPluginInterface = () => context => {
  context.applyWithDependency(
    AppRouteSurface,
    EntityPageSurface,
    // @ts-ignore routes that is not used
    (routes, surface) => {
      surface.addServicePageTab(
        <EntityLayout.Route
          if={isGitlabAvailable}
          path="/gitlab"
          title="Gitlab"
        >
          <EntityGitlabContent />
        </EntityLayout.Route>,
      );

      surface.addOverviewContent(
        <EntitySwitch>
          <EntitySwitch.Case if={isGitlabAvailable}>
            <Grid item md={12}>
              <EntityGitlabContributorsCard />
              <EntityGitlabLanguageCard />
              <EntityGitlabMergeRequestStatsCard />
              <EntityGitlabPipelinesTable />
              <EntityGitlabMergeRequestsTable />
            </Grid>
          </EntitySwitch.Case>
        </EntitySwitch>,
      );
    },
  );
};
