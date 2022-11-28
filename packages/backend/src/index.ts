import { BackendRuntime } from '@esback/runtime-backend';
import { plugin as testEntityProviderPlugin } from '@esback/plugin-test-entity-provider';
import { plugin as testEntityProcessorPlugin } from '@esback/plugin-test-entity-processor';
import { plugin as gitlabPlugin } from '@esback/plugin-gitlab-backend';

new BackendRuntime([
  testEntityProviderPlugin(),
  testEntityProcessorPlugin(),
  gitlabPlugin(),
]).start();
