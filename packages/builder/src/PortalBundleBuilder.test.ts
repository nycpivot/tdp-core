import { buildPortalBundle } from './PortalBundleBuilder';
import { EnvironmentProperties } from './EnvironmentProperties';

describe('Portal Bundle Builder', () => {
  it('uses environment properties to configure the bundle', () => {
    const env: EnvironmentProperties = {
      app_config: 'app-config.yaml',
      output_folder: 'output',
      tpb_config: 'conf/tpb-config.yaml',
      registry: 'verdaccio',
    };

    const bundle = buildPortalBundle(env, file => file);

    expect(bundle.outputFolder).toEqual(env.output_folder);
    expect(bundle.appConfig).toEqual(env.app_config);
    expect(bundle.bundleFolder).toEqual('bundle');
    expect(bundle.registry.registry).toEqual('verdaccio');
  });

  it('provides proper defaults when environment properties are undefined', () => {
    const env: EnvironmentProperties = {
      app_config: undefined,
      output_folder: undefined,
      tpb_config: undefined,
      registry: undefined,
    };

    const bundle = buildPortalBundle(env, file => file);

    expect(bundle.outputFolder).toEqual('portal');
    expect(bundle.appConfig).toEqual('conf/app-config.yaml');
    expect(bundle.bundleFolder).toEqual('bundle');
    expect(bundle.registry.registry).toEqual('artifactory');
  });

  it('forces clarity theme', () => {
    const env: EnvironmentProperties = {
      app_config: undefined,
      output_folder: undefined,
      tpb_config: undefined,
      registry: undefined,
    };

    const bundle = buildPortalBundle(env, file => file);
    const pluginsResolver = bundle.registry;
  });
});
