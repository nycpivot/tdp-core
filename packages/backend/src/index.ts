import { BackendRuntime } from '@esback/runtime-backend';
import { plugin as catalogTestEntityProviderPlugin } from '@esback/plugin-catalog-test-entity-provider';
import { plugin as catalogTestEntityProcessorPlugin } from '@esback/plugin-catalog-test-entity-processor';
import { plugin as gitlabPlugin } from '@esback/plugin-gitlab-backend';

new BackendRuntime([
  catalogTestEntityProviderPlugin(),
  catalogTestEntityProcessorPlugin(),
  gitlabPlugin(),
]).start();
