import { RegistryType } from './PluginsResolver';

export type EnvironmentProperties = {
  app_config?: string;
  output_folder?: string;
  tpb_config?: string;
  registry?: RegistryType;
  production?: string;
  yarnrc_config?: string;
};
