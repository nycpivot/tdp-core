import { BackendRuntime } from '@esback/runtime-backend';
import { plugin as catalogEntityProviderPlugin } from '@esback/plugin-test-entity-provider';
import { plugin as catalogProcessorPlugin } from '@esback/plugin-test-entity-processor';
import { plugin as gitlabPlugin } from '@esback/plugin-gitlab-backend';

new BackendRuntime([
  catalogEntityProviderPlugin(),
  catalogProcessorPlugin(),
  gitlabPlugin(),
]).start();
