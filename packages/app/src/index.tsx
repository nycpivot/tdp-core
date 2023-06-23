import '@backstage/cli/asset-types';
import { AppRuntime } from '@tpb/runtime';
import { plugin as themePlugin } from '@tpb/plugin-clarity-theming';
import { plugin as gitlabPlugin } from '@tpb/plugin-gitlab-loblaw';
import { plugin as rrvPlugin } from '@tpb/plugin-rrv';
import { plugin as appLiveViewPlugin } from '@tpb/plugin-app-live-view';
import { plugin as oktaAuthPlugin } from '@tpb/plugin-okta-auth';
import { plugin as oidcAuthPlugin } from '@tpb/plugin-oidc-auth';
import { plugin as azureAuthPlugin } from '@tpb/plugin-azure-auth';
import { plugin as githubAuthPlugin } from '@tpb/plugin-github-auth';
import { plugin as gitlabAuthPlugin } from '@tpb/plugin-gitlab-auth';
import { plugin as googleAuthPlugin } from '@tpb/plugin-google-auth';
import { plugin as auth0AuthPlugin } from '@tpb/plugin-auth0-auth';
import { plugin as bitbucketAuthPlugin } from '@tpb/plugin-bitbucket-auth';
import { plugin as oneLoginAuthPlugin } from '@tpb/plugin-onelogin-auth';
import { plugin as guestAuthPlugin } from '@tpb/plugin-guest-auth';
import { plugin as permissionTestAuthPlugin } from '@tpb/plugin-permission-test-auth';
import { plugin as vmwareCloudServicesAuthPlugin } from '@tpb/plugin-vmware-cloud-services-auth';
import { plugin as appAcceleratorPlugin } from '@tpb/plugin-app-accelerator-scaffolder';
import { plugin as pendoPlugin } from '@tpb/plugin-pendo-analytics';
import { plugin as scoringPlugin } from '@tpb/plugin-api-scoring';
import { plugin as supplyChainPlugin } from '@tpb/plugin-supply-chain';
import { plugin as securityAnalysisPlugin } from '@tpb/plugin-security-analysis-frontend';
import { plugin as techInsightsPlugin } from '@tpb/plugin-techinsights';
import { plugin as githubActionsPlugin } from '@tpb/plugin-github-actions';
import { plugin as backstageSonarqubePlugin } from '@tpb/plugin-backstage-sonarqube';

import '@tpb/plugin-clarity-theming/style/clarity.css';

new AppRuntime([
  themePlugin(),
  appAcceleratorPlugin(),
  appLiveViewPlugin(),
  supplyChainPlugin(),
  securityAnalysisPlugin(),
  gitlabPlugin(),
  rrvPlugin(),
  oktaAuthPlugin(),
  oidcAuthPlugin(),
  azureAuthPlugin(),
  githubAuthPlugin(),
  gitlabAuthPlugin(),
  auth0AuthPlugin(),
  bitbucketAuthPlugin(),
  googleAuthPlugin(),
  oneLoginAuthPlugin(),
  guestAuthPlugin(),
  permissionTestAuthPlugin(),
  vmwareCloudServicesAuthPlugin(),
  pendoPlugin(),
  scoringPlugin(),
  techInsightsPlugin(),
  githubActionsPlugin(),
  backstageSonarqubePlugin(),
]).render();
