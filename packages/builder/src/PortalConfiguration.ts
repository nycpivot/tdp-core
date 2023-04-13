import { PluginsResolver } from './PluginsResolver';
import { EnvironmentProperties } from './EnvironmentProperties';
import { parse as parseYaml } from 'yaml';
import { registryConfiguration, yarnResolver } from './Registry';
import { FilePath, PathResolver, readContent } from './File';
import {buildStructure, BundleStructure} from './BundleStructure';

export type PortalConfiguration = {
  registryConfiguration: FilePath;
  appConfig: FilePath;
  outputFolder: FilePath;
  pluginsResolver: PluginsResolver;
  structure: BundleStructure;
};

export const mapEnvProperties = (
  env: EnvironmentProperties,
  resolvePath: PathResolver,
): PortalConfiguration => {
  const configFile = env.tpb_config || 'conf/tpb-config.yaml';
  const outputFolder = env.output_folder || 'portal';
  const appConfig = env.app_config || 'conf/app-config.yaml';
  const registry = env.registry || 'remote';

  return {
    appConfig: resolvePath(appConfig),
    outputFolder: outputFolder,
    pluginsResolver: new PluginsResolver(
      parseYaml(readContent(resolvePath(configFile))),
      yarnResolver(outputFolder),
    ),
    registryConfiguration: resolvePath(registryConfiguration(registry)),
    structure: buildStructure(
      parseYaml(readContent(resolvePath('conf/bundle-structure.yaml'))),
      resolvePath,
    ),
  };
};
