import { buildPortalBundle } from './PortalBundleBuilder';
import { EnvironmentProperties } from './EnvironmentProperties';

describe('Portal Bundle Builder', () => {
  it('uses environment properties to configure the bundle', () => {
    const env: EnvironmentProperties = {
      app_config: 'app-config.yaml',
      output_folder: 'output',
      tpb_config: 'conf/default-manifest.yaml',
    };

    const bundle = buildPortalBundle(env, file => file);

    expect(bundle.outputFolder).toEqual(env.output_folder);
    expect(bundle.appConfig).toEqual(env.app_config);
    expect(bundle.buildAppConfig).toEqual('conf/app-config.yaml');
    expect(bundle.bundleFolder).toEqual('bundle');
  });

  it('provides proper defaults when environment properties are undefined', () => {
    const env: EnvironmentProperties = {
      app_config: undefined,
      output_folder: undefined,
      tpb_config: undefined,
    };

    const bundle = buildPortalBundle(env, file => file);

    expect(bundle.outputFolder).toEqual('portal');
    expect(bundle.appConfig).toEqual('conf/app-config.yaml');
    expect(bundle.buildAppConfig).toEqual('conf/app-config.yaml');
    expect(bundle.bundleFolder).toEqual('bundle');
  });
});
