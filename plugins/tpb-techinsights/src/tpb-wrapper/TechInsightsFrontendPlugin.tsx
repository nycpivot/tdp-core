import { EntityLayout } from '@backstage/plugin-catalog';
import { EntityTechInsightsScorecardContent } from '@backstage/plugin-tech-insights';
import { AppPluginInterface, AppRouteSurface } from '@tpb/core-frontend';
import { EntityPageSurface } from '@tpb/plugin-catalog';
import React from 'react';

export const TechInsightsFrontendPlugin: AppPluginInterface = () => context => {
  context.applyWithDependency(
    AppRouteSurface,
    EntityPageSurface,
    (_, surface) => {
      surface.servicePage.addTab(
        <EntityLayout.Route path="/techinsights" title="TechInsights">
          <EntityTechInsightsScorecardContent
            title="TechInsights Scorecard."
            description="TechInsight's default fact-checkers"
          />
        </EntityLayout.Route>,
      );
    },
  );
};
