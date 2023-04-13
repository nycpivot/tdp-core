import { PluginsResolver } from './PluginsResolver';
import { EnvironmentProperties } from './EnvironmentProperties';
import { parse as parseYaml } from 'yaml';
import { Registry, yarnResolver } from './Registry';
import { FilePath, PathResolver, readContent } from './FileContent';

export type PortalConfiguration = {
  registry: Registry;
  appConfig: FilePath;
  outputFolder: FilePath;
  pluginsResolver: PluginsResolver;
  structure: any;
};

export const mapEnvProperties = (
  env: EnvironmentProperties,
  resolvePath: PathResolver,
): PortalConfiguration => {
  const configFile = env.tpb_config || 'conf/tpb-config.yaml';
  const outputFolder = env.output_folder || 'portal';
  const appConfig = env.app_config || 'conf/app-config.yaml';

  return {
    appConfig: resolvePath(appConfig),
    outputFolder: outputFolder,
    pluginsResolver: new PluginsResolver(
      parseYaml(readContent(resolvePath(configFile))),
      yarnResolver(outputFolder),
    ),
    registry: env.registry || 'remote',
    structure: parseYaml(
      readContent(resolvePath('conf/bundle-structure.yaml')),
    ),
  };
};
