import { PluginsConfiguration } from './PluginsConfiguration';
import { EnvironmentProperties } from './EnvironmentProperties';
import { parse as parseYaml } from 'yaml';
import * as fs from 'fs';
import { yarnResolver } from './Registry';

export type PortalConfiguration = {
  mode: 'production' | 'development';
  appConfig: string;
  outputFolder: string;
  pluginsConfig: PluginsConfiguration;
  readFileContent: (file: string) => string;
};

export const mapEnvProperties = (
  env: EnvironmentProperties,
): PortalConfiguration => {
  const configFile = env.tpb_config || env.pathResolver('conf/tpb-config.yaml');
  const outputFolder = env.output_folder || 'portal';
  const yarnrcFolder = env.yarnrc_folder || outputFolder;
  const appConfig = env.app_config || 'conf/app-config.yaml';

  return {
    appConfig: appConfig,
    outputFolder: outputFolder,
    pluginsConfig: new PluginsConfiguration(
      parseYaml(fs.readFileSync(configFile).toString('utf-8')),
      yarnResolver(yarnrcFolder),
    ),
    readFileContent: env.readFileContent,
    mode: env.production ? 'production' : 'development',
  };
};
