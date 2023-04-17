import { EnvironmentProperties } from './EnvironmentProperties';
import { buildPluginsResolver } from './PluginsResolver';
import { PathResolver } from './FileUtils';
import { PortalBundle } from '../PortalBundle';
import { YarnResolver } from './YarnResolver';

export const buildPortalBundle = (
  env: EnvironmentProperties,
  resolvePath: PathResolver,
) => {
  const configFile = resolvePath(env.tpb_config || 'conf/tpb-config.yaml');
  const outputFolder = resolvePath(env.output_folder || 'portal');
  const appConfig = resolvePath(env.app_config || 'conf/app-config.yaml');
  const registryType = env.registry || 'artifactory';
  const yarnrcConfig = resolvePath(
    env.yarnrc_config || `bundle/.yarnrc.${registryType}`,
  );
  const yarnResolver = new YarnResolver(outputFolder, yarnrcConfig);

  return new PortalBundle(
    'bundle',
    outputFolder,
    appConfig,
    buildPluginsResolver(configFile, registryType, yarnResolver),
  );
};
