import React from 'react'
import { AppPluginInterface } from "@esback/core"
import { EntityLayout, EntitySwitch } from "@backstage/plugin-catalog"
import { Grid } from '@material-ui/core';
import {
    isGitlabAvailable,
    EntityGitlabContent,
    EntityGitlabLanguageCard,
    EntityGitlabContributorsCard,
  } from '@loblaw/backstage-plugin-gitlab';

export const GitlabPlugin: AppPluginInterface = () => {
  return {
    entityPage: (surface) => {
      surface.addServicePageTab(
        <EntityLayout.Route if={isGitlabAvailable} path="/gitlab" title="Gitlab">
          <EntityGitlabContent />
        </EntityLayout.Route>
      )

      surface.addOverviewContent(
        <EntitySwitch>
          <EntitySwitch.Case if={isGitlabAvailable}>
            <Grid item md={6}>
              <EntityGitlabContributorsCard />
            </Grid>
            <Grid item md={6}>
              <EntityGitlabLanguageCard />
            </Grid>
          </EntitySwitch.Case>
        </EntitySwitch>
      )
    }
  }
}