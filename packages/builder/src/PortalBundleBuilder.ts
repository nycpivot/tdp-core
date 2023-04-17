import { EnvironmentProperties } from './EnvironmentProperties';
import { buildPluginsResolver, UnresolvedPlugins } from './PluginsResolver';
import { PathResolver, readContent } from './FileUtils';
import { PortalBundle } from './PortalBundle';
import { YarnResolver } from './YarnResolver';
import { parse as parseYaml } from 'yaml';

export const buildPortalBundle = (
  env: EnvironmentProperties,
  resolvePath: PathResolver,
) => {
  const outputFolder = resolvePath(env.output_folder || 'portal');
  const appConfig = resolvePath(env.app_config || 'conf/app-config.yaml');
  const registryType = env.registry || 'artifactory';
  const yarnrcConfig = resolvePath(
    env.yarnrc_config || `bundle/.yarnrc.${registryType}`,
  );

  const yarnResolver = new YarnResolver(outputFolder, yarnrcConfig);
  const tpbConfig: UnresolvedPlugins = env.tpb_config
    ? parseYaml(readContent(resolvePath(env.tpb_config)))
    : {
        apps: {
          plugins: [],
        },
        backend: {
          plugins: [],
        },
      };

  return new PortalBundle(
    'bundle',
    outputFolder,
    appConfig,
    buildPluginsResolver(tpbConfig, registryType, yarnResolver),
  );
};
