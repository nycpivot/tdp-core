import { RegistryType } from './Registry';

export type EnvironmentProperties = {
  app_config: string | undefined;
  output_folder: string | undefined;
  tpb_config: string | undefined;
  registry: RegistryType | undefined;
  production?: string | undefined;
};
