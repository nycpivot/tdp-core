import { BackendRuntime } from '@tpb/runtime-backend';
import { plugin as catalogTestEntityProviderPlugin } from '@tpb/plugin-catalog-test-entity-provider';
import { plugin as catalogTestEntityProcessorPlugin } from '@tpb/plugin-catalog-test-entity-processor';
import { plugin as microsoftGraphOrgReaderProcessorPlugin } from '@tpb/plugin-microsoft-graph-org-reader-processor';
import { plugin as awsS3DiscoveryProcessorPlugin } from '@tpb/plugin-aws-s3-discovery-processor';
import { plugin as gitlabPlugin } from '@tpb/plugin-gitlab-backend';
import { plugin as azureDevOpsPlugin } from '@tpb/plugin-azure-devops-backend';
import { plugin as githubPlugin } from '@tpb/plugin-github-backend';
import { plugin as kubernetesPlugin } from '@tpb/plugin-kubernetes-backend';
import { plugin as kubernetesCustomApisPlugin } from '@tpb/plugin-kubernetes-custom-apis-backend';
import { plugin as oidcAuthBackendPlugin } from '@tpb/plugin-oidc-auth-backend';
import { plugin as oktaAuthBackendPlugin } from '@tpb/plugin-okta-auth-backend';
import { plugin as azureAuthBackendPlugin } from '@tpb/plugin-azure-auth-backend';
import { plugin as githubAuthBackendPlugin } from '@tpb/plugin-github-auth-backend';
import { plugin as gitlabAuthBackendPlugin } from '@tpb/plugin-gitlab-auth-backend';
import { plugin as googleAuthBackendPlugin } from '@tpb/plugin-google-auth-backend';
import { plugin as bitbucketAuthBackendPlugin } from '@tpb/plugin-bitbucket-auth-backend';
import { plugin as auth0BackendPlugin } from '@tpb/plugin-auth0-auth-backend';
import { plugin as oneLoginBackendPlugin } from '@tpb/plugin-onelogin-auth-backend';
import { plugin as oidcAuthesolverPlugin } from '@tpb/plugin-oidc-auth-resolver';
import { plugin as oktaAuthResolverPlugin } from '@tpb/plugin-okta-auth-resolver';
import { plugin as azureAuthResolverPlugin } from '@tpb/plugin-azure-auth-resolver';
import { plugin as githubAuthResolverPlugin } from '@tpb/plugin-github-auth-resolver';
import { plugin as gitlabAuthResolverPlugin } from '@tpb/plugin-gitlab-auth-resolver';
import { plugin as googleAuthResolverPlugin } from '@tpb/plugin-google-auth-resolver';
import { plugin as bitbucketAuthResolverPlugin } from '@tpb/plugin-bitbucket-auth-resolver';
import { plugin as auth0AuthResolverPlugin } from '@tpb/plugin-auth0-auth-resolver';
import { plugin as oneLoginAuthResolverPlugin } from '@tpb/plugin-onelogin-auth-resolver';
import { plugin as ldapBackendPlugin } from '@tpb/plugin-ldap-backend';
import { plugin as ldapTransformersPlugin } from '@tpb/plugin-ldap-test-transformers';
import { plugin as microsoftGraphOrgReaderProcessorTestTransformersPlugin } from '@tpb/plugin-microsoft-graph-org-reader-processor-test-transformers';
import { plugin as permissionBackendPlugin } from '@tpb/plugin-permission-backend';
import { plugin as permissionTestAuthBackendPlugin } from '@tpb/plugin-permission-test-auth-backend';
import { plugin as backstageUserSettingsBackendPlugin } from '@tpb/plugin-backstage-user-settings-backend';
import { plugin as pendoBackendPlugin } from '@tpb/plugin-pendo-analytics-backend';
import { plugin as vmwareCloudServicesAuthBackendPlugin } from '@tpb/plugin-vmware-cloud-services-auth-backend';
import { plugin as appAcceleratorBackendPlugin } from '@tpb/plugin-app-accelerator-backend';
import { plugin as gitProvidersBackend } from '@tpb/plugin-git-providers-backend';
import { plugin as autoRegistrationPlugin } from '@tpb/plugin-api-auto-registration-backend';
import { plugin as customLoggerPlugin } from '@tpb/tpb-custom-logger';
import { plugin as techInsightsBackendPlugin } from '@tpb/plugin-techinsights-backend';
import { plugin as backstageSonarqubeBackendPlugin } from '@tpb/plugin-backstage-sonarqube-backend';

new BackendRuntime([
  catalogTestEntityProviderPlugin(),
  catalogTestEntityProcessorPlugin(),
  microsoftGraphOrgReaderProcessorPlugin(),
  awsS3DiscoveryProcessorPlugin(),
  microsoftGraphOrgReaderProcessorTestTransformersPlugin(),
  gitlabPlugin(),
  azureDevOpsPlugin(),
  githubPlugin(),
  kubernetesPlugin(),
  kubernetesCustomApisPlugin(),
  oidcAuthBackendPlugin(),
  oktaAuthBackendPlugin(),
  azureAuthBackendPlugin(),
  githubAuthBackendPlugin(),
  gitlabAuthBackendPlugin(),
  googleAuthBackendPlugin(),
  bitbucketAuthBackendPlugin(),
  auth0BackendPlugin(),
  oneLoginBackendPlugin(),
  oidcAuthesolverPlugin(),
  oktaAuthResolverPlugin(),
  azureAuthResolverPlugin(),
  githubAuthResolverPlugin(),
  gitlabAuthResolverPlugin(),
  googleAuthResolverPlugin(),
  bitbucketAuthResolverPlugin(),
  auth0AuthResolverPlugin(),
  oneLoginAuthResolverPlugin(),
  ldapBackendPlugin(),
  ldapTransformersPlugin(),
  permissionTestAuthBackendPlugin(),
  vmwareCloudServicesAuthBackendPlugin(),
  permissionBackendPlugin(),
  backstageUserSettingsBackendPlugin(),
  pendoBackendPlugin(),
  appAcceleratorBackendPlugin(),
  gitProvidersBackend(),
  autoRegistrationPlugin(),
  customLoggerPlugin(),
  techInsightsBackendPlugin(),
  backstageSonarqubeBackendPlugin(),
]).start();
