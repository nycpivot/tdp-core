import React from 'react';
import { AppPluginInterface, AppRouteSurface } from '@tpb/core-frontend';
import { EntityPageSurface } from '@tpb/plugin-catalog';
import { EntityLayout } from '@backstage/plugin-catalog';
import {
  EntityPrometheusAlertCard,
  EntityPrometheusContent,
  EntityPrometheusGraphCard,
} from '@roadiehq/backstage-plugin-prometheus';
import { Grid } from '@material-ui/core';

export const PrometheusPlugin: AppPluginInterface = () => context => {
  context.applyWithDependency(
    AppRouteSurface,
    EntityPageSurface,
    (_, entityPageSurface) => {
      entityPageSurface.addOverviewContent(
        <Grid item md={8}>
          <EntityPrometheusAlertCard />
        </Grid>,
      );
      entityPageSurface.addOverviewContent(
        <Grid item md={6}>
          <EntityPrometheusGraphCard />
        </Grid>,
      );
      entityPageSurface.servicePage.addTab(
        <EntityLayout.Route path="/prometheus" title="Prometheus">
          <EntityPrometheusContent />
        </EntityLayout.Route>,
      );
    },
  );
};
