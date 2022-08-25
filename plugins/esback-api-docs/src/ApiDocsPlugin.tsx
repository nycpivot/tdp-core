import React from 'react'
import { Route } from 'react-router'
import { AppPluginInterface } from "@esback/core"
import { ApiExplorerPage, EntityApiDefinitionCard, EntityConsumedApisCard, EntityConsumingComponentsCard, EntityProvidedApisCard, EntityProvidingComponentsCard } from '@backstage/plugin-api-docs'
import ExtensionIcon from '@material-ui/icons/Extension';
import { SidebarItem } from '@backstage/core-components';
import { EntityLayout } from '@backstage/plugin-catalog'
import { Grid } from '@material-ui/core';

export const ApiDocsPlugin: AppPluginInterface = () => {
  return {
    entityPage: (surface) => {
      surface.addServicePageTab(
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
      )

      surface.addApiPageTab(
        <EntityLayout.Route path="/definition" title="Definition">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <EntityApiDefinitionCard />
            </Grid>
            <Grid container item md={12}>
              <Grid item md={6}>
                <EntityProvidingComponentsCard />
              </Grid>
              <Grid item md={6}>
                <EntityConsumingComponentsCard />
              </Grid>
            </Grid>
          </Grid>
        </EntityLayout.Route>
      )
    },
    routes: (surface) => surface.add(<Route path="/api-docs" element={<ApiExplorerPage />} />),
    sidebarItems: (surface) => surface.add(<SidebarItem icon={ExtensionIcon} to="api-docs" text="APIs" />)
  }
}