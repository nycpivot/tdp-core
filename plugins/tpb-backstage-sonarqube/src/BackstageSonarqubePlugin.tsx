import { EntitySonarQubeCard } from '@backstage/plugin-sonarqube';
import { Grid } from '@material-ui/core';
import { AppPluginInterface, AppRouteSurface } from '@tpb/core-frontend';
import { EntityPageSurface } from '@tpb/plugin-catalog';
import React from 'react';

export const BackstageSonarqubePlugin: AppPluginInterface = () => context => {
  context.applyWithDependency(
    AppRouteSurface,
    EntityPageSurface,
    (_, surface) => {
      surface.addOverviewContent(
        <Grid item md={5} xs={12}>
          <EntitySonarQubeCard variant="gridItem" />
        </Grid>,
      );
    },
  );
};
