import { EnvironmentProperties } from './EnvironmentProperties';
import { parse as parseYaml } from 'yaml';
import { Registry, RegistryType, yarnResolver } from './Registry';
import { FilePath, PathResolver, readContent } from './FileUtils';
import { PortalBundle } from '../PortalBundle';

function buildRegistry(
  resolvePath: (file: FilePath) => FilePath,
  configFile: string,
  outputFolder: string,
  registryType: RegistryType,
) {
  const yaml = parseYaml(readContent(configFile));
  // we force the theme for the moment.
  return new Registry(
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
    registryType,
  );
}
export const buildPortalBundle = (
  env: EnvironmentProperties,
  resolvePath: PathResolver,
) => {
  const configFile = env.tpb_config || 'conf/tpb-config.yaml';
  const outputFolder = env.output_folder || 'portal';
  const appConfig = env.app_config || 'conf/app-config.yaml';
  const registryType = env.registry || 'artifactory';

  return new PortalBundle(
    resolvePath('bundle'),
    resolvePath(outputFolder),
    resolvePath(appConfig),
    buildRegistry(
      resolvePath,
      resolvePath(configFile),
      outputFolder,
      registryType,
    ),
  );
};
