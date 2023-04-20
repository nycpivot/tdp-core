export type EnvironmentProperties = {
  app_config?: string;
  output_folder?: string;
  tpb_config?: string;
  registry?: 'verdaccio' | 'artifactory';
  yarnrc_config?: string;
};
