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
import { plugin as ldapBackendPlugin } from '@tpb/plugin-ldap-backend';
import { plugin as ldapTransformersPlugin } from '@tpb/plugin-ldap-test-transformers';
import { plugin as microsoftGraphOrgReaderProcessorTestTransformersPlugin } from '@tpb/plugin-microsoft-graph-org-reader-processor-test-transformers';

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
  ldapBackendPlugin(),
  ldapTransformersPlugin(),
]).start();
