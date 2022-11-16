import { BackendRuntime } from '@esback/runtime-backend';
import { plugin as catalogEntityProviderPlugin } from '@esback/plugin-catalog-entity-provider';
import { plugin as catalogProcessorPlugin } from '@esback/plugin-catalog-processor';

new BackendRuntime([
  catalogEntityProviderPlugin(),
  catalogProcessorPlugin(),
]).start();
