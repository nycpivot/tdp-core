import React from 'react'
import { AppPluginInterface, RoutableConfig } from "@esback/core"
import { EntityLayout, EntitySwitch } from "@backstage/plugin-catalog"
import { Grid } from '@material-ui/core';
import {
  isGitlabAvailable,
  EntityGitlabContent,
  EntityGitlabLanguageCard,
  EntityGitlabContributorsCard,
  EntityGitlabMergeRequestsTable,
  EntityGitlabMergeRequestStatsCard,
  EntityGitlabPipelinesTable,
} from '@loblaw/backstage-plugin-gitlab';

interface GitlabConfig {
  tab?: boolean
  overview?: {
    contributors?: boolean
    language?: boolean
    mrs?: boolean
    mrStats?: boolean
    pipelines?: boolean
  }
}

export const GitlabPlugin: AppPluginInterface<GitlabConfig & RoutableConfig> = (config) => {
  const { label, path, tab } = {
    tab: true,
    label: "Gitlab",
    path: "gitlab",
    ...config
  }

  const { contributors, language, mrs, mrStats, pipelines } = config?.overview ?? {
    language: true,
    mrStats: true,
  }

  return {
    entityPage: (surface) => {
      if (tab) {
        surface.addServicePageTab(
          <EntityLayout.Route if={isGitlabAvailable} path={`/${path}`} title={label}>
            <EntityGitlabContent />
          </EntityLayout.Route>
        )
      }

      const gridItems = []

      if (contributors) {
        gridItems.push(<EntityGitlabContributorsCard />)
      }

      if (language) {
        gridItems.push(<EntityGitlabLanguageCard />)
      }

      if (mrs) {
        gridItems.push(<EntityGitlabMergeRequestsTable />)
      }

      if (mrStats) {
        gridItems.push(<EntityGitlabMergeRequestStatsCard />)
      }

      if (pipelines) {
        gridItems.push(<EntityGitlabPipelinesTable />)
      }

      if (gridItems.length > 0) {
        surface.addOverviewContent(
          <EntitySwitch>
            <EntitySwitch.Case if={isGitlabAvailable}>
            {gridItems.map(gitlabCard => (
              <Grid item md={6}>
                {gitlabCard}
              </Grid>
            ))}
            </EntitySwitch.Case>
          </EntitySwitch>
        )
      }
    }
  }
}