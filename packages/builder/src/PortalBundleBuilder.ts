import { EnvironmentProperties } from './EnvironmentProperties';
import { buildRegistry } from './Registry';
import { PathResolver } from './FileUtils';
import { PortalBundle } from '../PortalBundle';

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
    buildRegistry(resolvePath(configFile), outputFolder, registryType),
  );
};
