import { PluginsConfiguration } from './PluginsConfiguration';
import { EnvironmentProperties } from './EnvironmentProperties';
import { parse as parseYaml } from 'yaml';
import { Registry, yarnResolver } from './Registry';
import { PathResolver, readContent } from './FileContent';

export type PortalConfiguration = {
  registry: Registry;
  appConfig: string;
  outputFolder: string;
  pluginsConfig: PluginsConfiguration;
};

export const mapEnvProperties = (
  env: EnvironmentProperties,
  resolvePath: PathResolver,
): PortalConfiguration => {
  const configFile = env.tpb_config || 'conf/tpb-config.yaml';
  const outputFolder = env.output_folder || 'portal';
  const appConfig = env.app_config || 'conf/app-config.yaml';

  return {
    appConfig: appConfig,
    outputFolder: outputFolder,
    pluginsConfig: new PluginsConfiguration(
      parseYaml(readContent(configFile, resolvePath)),
      yarnResolver(outputFolder),
    ),
    registry: env.registry || 'remote',
  };
};
