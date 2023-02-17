import { BackendRuntime } from '@esback/runtime-backend';
import { plugin as catalogTestEntityProviderPlugin } from '@esback/plugin-catalog-test-entity-provider';
import { plugin as catalogTestEntityProcessorPlugin } from '@esback/plugin-catalog-test-entity-processor';
import { plugin as microsoftGraphOrgReaderProcessorPlugin } from '@esback/plugin-microsoft-graph-org-reader-processor';
import { plugin as awsS3DiscoveryProcessorPlugin } from '@esback/plugin-aws-s3-discovery-processor';
import { plugin as gitlabPlugin } from '@esback/plugin-gitlab-backend';
import { plugin as azureDevOpsPlugin } from '@esback/plugin-azure-devops-backend';
import { plugin as githubPlugin } from '@esback/plugin-github-backend';
import { plugin as kubernetesPlugin } from '@esback/plugin-kubernetes-backend';
import { plugin as kubernetesLoggingPlugin } from '@esback/plugin-kubernetes-logging-backend';
import { plugin as oidcAuthBackendPlugin } from '@esback/plugin-oidc-auth-backend';
import { plugin as oktaAuthBackendPlugin } from '@esback/plugin-okta-auth-backend';
import { plugin as azureAuthBackendPlugin } from '@esback/plugin-azure-auth-backend';
import { plugin as githubAuthBackendPlugin } from '@esback/plugin-github-auth-backend';
import { plugin as gitlabAuthBackendPlugin } from '@esback/plugin-gitlab-auth-backend';
import { plugin as googleAuthBackendPlugin } from '@esback/plugin-google-auth-backend';
import { plugin as bitbucketAuthBackendPlugin } from '@esback/plugin-bitbucket-auth-backend';
import { plugin as auth0BackendPlugin } from '@esback/plugin-auth0-auth-backend';
import { plugin as oneLoginBackendPlugin } from '@esback/plugin-onelogin-auth-backend';
import { plugin as ldapBackendPlugin } from '@esback/plugin-ldap-backend';
import { plugin as ldapTransformersPlugin } from '@esback/plugin-ldap-test-transformers';
import { plugin as microsoftGraphOrgReaderProcessorTestTransformersPlugin } from '@esback/plugin-microsoft-graph-org-reader-processor-test-transformers';

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
  kubernetesLoggingPlugin(),
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
