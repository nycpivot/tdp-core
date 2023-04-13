import { Registry } from './Registry';

export type EnvironmentProperties = {
  app_config: string | undefined;
  output_folder: string | undefined;
  tpb_config: string | undefined;
  yarnrc_folder: string | undefined;
  registry: Registry | undefined;
  production: string | undefined;
};
