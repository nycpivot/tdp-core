import React from 'react'
import { Route } from 'react-router'
import { AppPluginInterface, RoutableConfig } from "@tanzu/backstage-core"
import { ApiExplorerPage, EntityApiDefinitionCard, EntityConsumedApisCard, EntityConsumingComponentsCard, EntityProvidedApisCard, EntityProvidingComponentsCard } from '@backstage/plugin-api-docs'
import ExtensionIcon from '@material-ui/icons/Extension';
import { SidebarItem } from '@backstage/core-components';
import { EntityLayout } from '@backstage/plugin-catalog'
import { Grid } from '@material-ui/core';

interface ApiDocsConfig {
  catalogPages?: { api?: RoutableConfig, service?: RoutableConfig }
  sidebar?: RoutableConfig
}

export const ApiDocsPlugin: AppPluginInterface<ApiDocsConfig> = (config) => {
  const apiPage = {
    path: "definition",
    label: "Definition",
    ...config?.catalogPages?.api
  }

  const servicePage = {
    path: "api",
    label: "API",
    ...config?.catalogPages?.service
  }

  const sidebar = {
    path: "api-docs",
    label: "APIs",
    ...config?.sidebar
  }

  return {
    entityPage: (surface) => {
      surface.addServicePageTab(
        <EntityLayout.Route path={`/${servicePage.path}`} title={servicePage.label}>
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
        <EntityLayout.Route path={`/${apiPage.path}`} title={apiPage.label}>
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
    routes: (surface) => surface.add(<Route path={`/${sidebar.path}`} element={<ApiExplorerPage />} />),
    sidebarItems: (surface) => surface.add(<SidebarItem icon={ExtensionIcon} to={sidebar.path} text={sidebar.label} />)
  }
}