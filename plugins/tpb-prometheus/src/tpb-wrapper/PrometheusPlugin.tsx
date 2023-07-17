import React from 'react';
import { AppPluginInterface } from '@tpb/core-frontend';
import { EntityPageSurface } from '@tpb/plugin-catalog';
import { EntityLayout } from '@backstage/plugin-catalog';
import {
  EntityPrometheusAlertCard,
  EntityPrometheusContent,
  EntityPrometheusGraphCard,
} from '@roadiehq/backstage-plugin-prometheus';
import { Grid } from '@material-ui/core';

export const PrometheusPlugin: AppPluginInterface = () => context => {
  context.applyTo(EntityPageSurface, entityPageSurface => {
    entityPageSurface.addOverviewContent(
      <Grid item md={6}>
        <div id="prometheus-alert-overview">
          <EntityPrometheusAlertCard />
        </div>
      </Grid>,
    );
    entityPageSurface.addOverviewContent(
      <Grid item md={6}>
        <div id="prometheus-graph-overview">
          <EntityPrometheusGraphCard />
        </div>
      </Grid>,
    );
    entityPageSurface.servicePage.addTab(
      <EntityLayout.Route path="/prometheus" title="Prometheus">
        <EntityPrometheusContent />
      </EntityLayout.Route>,
    );
  });
};
