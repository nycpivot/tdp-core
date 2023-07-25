import { Grid } from '@material-ui/core';
import { AppPluginInterface, AppRouteSurface } from '@tpb/core-frontend';
import { EntityPageSurface } from '@tpb/plugin-catalog';
import React from 'react';
import {
  EntityJiraOverviewCard,
  isJiraAvailable,
} from '@roadiehq/backstage-plugin-jira';
import { EntitySwitch } from '@backstage/plugin-catalog';

export const BackstageJiraPlugin: AppPluginInterface = () => context => {
  context.applyWithDependency(
    AppRouteSurface,
    EntityPageSurface,
    (_, surface) => {
      surface.addOverviewContent(
        <EntitySwitch>
          <EntitySwitch.Case if={isJiraAvailable}>
            <Grid item md={7} xs={12}>
              <EntityJiraOverviewCard />
            </Grid>
          </EntitySwitch.Case>
        </EntitySwitch>,
      );
    },
  );
};
