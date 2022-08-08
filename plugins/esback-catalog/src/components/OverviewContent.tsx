import React from "react";
import { Grid } from '@material-ui/core';
import {
  EntityAboutCard,
  EntityHasSubcomponentsCard,
  EntityLinksCard,
} from '@backstage/plugin-catalog';
import {
  EntityCatalogGraphCard,
} from '@backstage/plugin-catalog-graph';
import { EntityWarningContent } from "./EntityWarningContent";

export const OverviewContent: React.FC = () => (
  <Grid container spacing={3} alignItems="stretch">
    <EntityWarningContent />
    <Grid item md={6}>
      <EntityAboutCard variant="gridItem" />
    </Grid>
    <Grid item md={6} xs={12}>
      <EntityCatalogGraphCard variant="gridItem" height={400} />
    </Grid>

    <Grid item md={4} xs={12}>
      <EntityLinksCard />
    </Grid>
    <Grid item md={8} xs={12}>
      <EntityHasSubcomponentsCard variant="gridItem" />
    </Grid>
  </Grid>
);