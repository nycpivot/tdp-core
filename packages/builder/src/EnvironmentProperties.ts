export type EnvironmentProperties = {
  app_config?: string;
  output_folder?: string;
  tpb_config?: string;
  registry?: 'verdaccio' | 'artifactory';
  production?: string;
  yarnrc_config?: string;
};
