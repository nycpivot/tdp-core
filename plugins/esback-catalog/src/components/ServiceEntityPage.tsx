import React, { useContext } from 'react'
import {
    EntityLayout,
    EntityDependsOnComponentsCard,
    EntityDependsOnResourcesCard
} from "@backstage/plugin-catalog"
import { Grid } from '@material-ui/core';
import {
  EntityConsumedApisCard,
  EntityProvidedApisCard,
} from '@backstage/plugin-api-docs';
import { TechDocsContent } from './TechDocsContent';
import { OverviewContent } from './OverviewContent';
import { CicdContent } from './CicdContent';
import { AppSurfacesContext } from '@internal/plugin-app-builder';

export const ServiceEntityPage: React.FC = () => {
  const context = useContext(AppSurfacesContext)

  return (
    <EntityLayout>
      <EntityLayout.Route path="/" title="Overview">
          <OverviewContent />
      </EntityLayout.Route>

      <EntityLayout.Route path="/ci-cd" title="CI/CD">
          <CicdContent />
      </EntityLayout.Route>

      <EntityLayout.Route path="/api" title="API">
        <Grid container spacing={3} alignItems="stretch">
          <Grid item md={6}>
            <EntityProvidedApisCard />
          </Grid>
          <Grid item md={6}>
            <EntityConsumedApisCard />
          </Grid>
        </Grid>
      </EntityLayout.Route>

      <EntityLayout.Route path="/dependencies" title="Dependencies">
        <Grid container spacing={3} alignItems="stretch">
          <Grid item md={6}>
            <EntityDependsOnComponentsCard variant="gridItem" />
          </Grid>
          <Grid item md={6}>
            <EntityDependsOnResourcesCard variant="gridItem" />
          </Grid>
        </Grid>
      </EntityLayout.Route>

      <EntityLayout.Route path="/docs" title="Docs">
          <TechDocsContent />
      </EntityLayout.Route>

      {...context.entityPageSurface.servicePageTabs}
    </EntityLayout>
  )
}