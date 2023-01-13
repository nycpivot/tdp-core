import { BackendRuntime } from '@esback/runtime-backend';
import { plugin as catalogTestEntityProviderPlugin } from '@esback/plugin-catalog-test-entity-provider';
import { plugin as catalogTestEntityProcessorPlugin } from '@esback/plugin-catalog-test-entity-processor';
import { plugin as gitlabPlugin } from '@esback/plugin-gitlab-backend';
import { plugin as githubPlugin } from '@esback/plugin-github-backend';
import { plugin as kubernetesPlugin } from '@esback/plugin-kubernetes-backend';
import { plugin as kubernetesLoggingPlugin } from '@esback/plugin-kubernetes-logging-backend';
import { plugin as azureAuthBackendPlugin } from '@esback/plugin-azure-auth-backend';
import { plugin as gitlabAuthBackendPlugin } from '@esback/plugin-gitlab-auth-backend';
import { plugin as googleAuthBackendPlugin } from '@esback/plugin-google-auth-backend';
import { plugin as auth0BackendPlugin } from '@esback/plugin-auth0-auth-backend';

new BackendRuntime([
  catalogTestEntityProviderPlugin(),
  catalogTestEntityProcessorPlugin(),
  gitlabPlugin(),
  githubPlugin(),
  kubernetesPlugin(),
  kubernetesLoggingPlugin(),
  azureAuthBackendPlugin(),
  gitlabAuthBackendPlugin(),
  googleAuthBackendPlugin(),
  auth0BackendPlugin(),
]).start();
