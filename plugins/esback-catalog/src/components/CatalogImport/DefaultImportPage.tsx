import {
  Content,
  ContentHeader,
  Header,
  Page,
  SupportButton,
} from '@backstage/core-components';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { Grid, StepLabel } from '@material-ui/core';
import React from 'react';
import { ImportInfoCard } from './ImportInfoCard';
import {
  ImportStepper,
  defaultGenerateStepper,
} from '@backstage/plugin-catalog-import';
import { StepInitAnalyzeUrl } from './StepInitAnalyzeUrl';

export const DefaultImportPage = () => {
  const configApi = useApi(configApiRef);
  const appTitle =
    configApi.getOptional('app.title') || 'Tanzu Application Platform';
  const customStepperBuilder = (flow: any, defaults: any) => ({
    ...defaultGenerateStepper(flow, defaults),
    analyze: (state: any, { apis }: any) => ({
      stepLabel: <StepLabel>Select URL</StepLabel>,
      content: (
        <StepInitAnalyzeUrl
          key="analyze"
          analysisUrl={state.analysisUrl}
          onAnalysis={state.onAnalysis}
          disablePullRequest={!apis.catalogImportApi.preparePullRequest}
        />
      ),
    }),
  });

  return (
    <Page themeId="home">
      <Header title="Register an existing component" />
      <Content>
        <ContentHeader title={`Start tracking your component in ${appTitle}`}>
          <SupportButton>
            Start tracking your component in {appTitle} by adding it to the
            software catalog.
          </SupportButton>
        </ContentHeader>

        <Grid container spacing={2} direction="row-reverse">
          <Grid item xs={12} md={4} lg={6} xl={8}>
            <ImportInfoCard />
          </Grid>

          <Grid item xs={12} md={8} lg={6} xl={4}>
            <ImportStepper generateStepper={customStepperBuilder} />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
