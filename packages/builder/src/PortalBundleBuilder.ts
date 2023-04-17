import { EnvironmentProperties } from './EnvironmentProperties';
import { buildPluginsResolver } from './PluginsResolver';
import { PathResolver } from './FileUtils';
import { PortalBundle } from '../PortalBundle';
import { buildYarnResolver } from './YarnResolver';

export const buildPortalBundle = (
  env: EnvironmentProperties,
  resolvePath: PathResolver,
) => {
  const configFile = env.tpb_config || 'conf/tpb-config.yaml';
  const outputFolder = env.output_folder || 'portal';
  const appConfig = env.app_config || 'conf/app-config.yaml';
  const registryType = env.registry || 'artifactory';
  const yarnrcConfig = env.yarnrc_config || `bundle/.yarnrc.${registryType}`;

  const yarnResolver = buildYarnResolver(
    outputFolder,
    yarnrcConfig,
    registryType,
  );

  return new PortalBundle(
    resolvePath('bundle'),
    resolvePath(outputFolder),
    resolvePath(appConfig),
    buildPluginsResolver(resolvePath(configFile), registryType, yarnResolver),
  );
};
