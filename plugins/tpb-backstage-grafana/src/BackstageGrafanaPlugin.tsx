import {
  EntityGrafanaAlertsCard,
  EntityGrafanaDashboardsCard,
} from '@k-phoen/backstage-plugin-grafana';
import { Grid } from '@material-ui/core';
import { AppPluginInterface, AppRouteSurface } from '@tpb/core-frontend';
import { EntityPageSurface } from '@tpb/plugin-catalog';
import React from 'react';

export const BackstageGrafanaPlugin: AppPluginInterface = () => context => {
  context.applyWithDependency(
    AppRouteSurface,
    EntityPageSurface,
    (_, surface) => {
      surface.addOverviewContent(
        <Grid item md={7} xs={12}>
          <EntityGrafanaAlertsCard />
        </Grid>,
      );
      surface.addOverviewContent(
        <Grid item md={7} xs={12}>
          <EntityGrafanaDashboardsCard />
        </Grid>,
      );
    },
  );
};
