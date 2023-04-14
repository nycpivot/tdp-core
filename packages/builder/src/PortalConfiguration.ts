import { EnvironmentProperties } from './EnvironmentProperties';
import { parse as parseYaml } from 'yaml';
import { PluginsResolver, Registry, yarnResolver } from './Registry';
import { FilePath, PathResolver, readContent } from './FileUtils';

export type PortalConfiguration = {
  registry: Registry;
  appConfig: FilePath;
  outputFolder: FilePath;
  pluginsResolver: PluginsResolver;
};

function buildPluginsResolver(
  resolvePath: (file: FilePath) => FilePath,
  configFile: string,
  outputFolder: string,
) {
  const yaml = parseYaml(readContent(resolvePath(configFile)));
  // we force the theme for the moment.
  return new PluginsResolver(
    {
      app: {
        theme: {
          name: '@tpb/plugin-clarity-theme',
          stylesheet: '@tpb/plugin-clarity-theme/style/clarity.css',
        },
        plugins: yaml.app.plugins,
      },
      backend: yaml.backend,
    },
    yarnResolver(outputFolder),
  );
}

export const mapEnvProperties = (
  env: EnvironmentProperties,
  resolvePath: PathResolver,
): PortalConfiguration => {
  const configFile = env.tpb_config || 'conf/tpb-config.yaml';
  const outputFolder = env.output_folder || 'portal';
  const appConfig = env.app_config || 'conf/app-config.yaml';
  const registry = env.registry || 'artifactory';

  return {
    appConfig: resolvePath(appConfig),
    outputFolder: resolvePath(outputFolder),
    pluginsResolver: buildPluginsResolver(
      resolvePath,
      configFile,
      outputFolder,
    ),
    registry: registry,
  };
};
