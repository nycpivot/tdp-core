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
    // @ts-expect-error: TS6133
    (routes, surface) => {
      const component = (
        <EntityLayout.Route
          if={isGitlabAvailable}
          path="/gitlab"
          title="Gitlab"
        >
          <EntityGitlabContent />
        </EntityLayout.Route>
      );

      surface.addDefaultPageTab(component);
      surface.addServicePageTab(component);
      surface.addWebsitePageTab(component);

      surface.addOverviewContent(
        <EntitySwitch>
          <EntitySwitch.Case if={isGitlabAvailable}>
            <Grid item md={4}>
              <EntityGitlabContributorsCard />
            </Grid>
            <Grid item md={4}>
              <EntityGitlabLanguageCard />
            </Grid>
            <Grid item md={4}>
              <EntityGitlabMergeRequestStatsCard />
            </Grid>
            <Grid item md={12}>
              <EntityGitlabPipelinesTable />
            </Grid>
            <Grid item md={12}>
              <EntityGitlabMergeRequestsTable />
            </Grid>
          </EntitySwitch.Case>
        </EntitySwitch>,
      );
    },
  );
};
