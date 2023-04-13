import { PortalBundleBuilder } from './PortalBundleBuilder';
import { PortalConfiguration } from './PortalConfiguration';
import { PluginsResolver } from './PluginsResolver';

describe('Portal bundle builder', () => {
  const config: PortalConfiguration = {
    appConfig: 'app-config.yaml',
    registryConfiguration: 'src/assets/.yarnrc',
    outputFolder: 'output',
    pluginsResolver: new PluginsResolver(
      {
        app: {
          plugins: [],
        },
        backend: {
          plugins: [],
        },
      },
      () => '1.0.0',
    ),
    structure: {
      templates: [
        {
          file: 'package.json',
          template: 'src/assets/packages/app/package.json.hbs',
        },
      ],
      copies: [{ from: 'eslint.rc', to: '../../eslint.rc' }],
    },
  };

  it('provides a list of files to be copied', () => {
    const builder = new PortalBundleBuilder(config);
    const bundle = builder.build();

    expect(bundle.copyBundle.length).toBeGreaterThan(1);
  });

  it('provides a list of generated contents', () => {
    const builder = new PortalBundleBuilder(config);
    const bundle = builder.build();

    expect(bundle.contentBundle.length).toBeGreaterThan(1);
  });

  it('includes an app-config file', () => {
    const builder = new PortalBundleBuilder(config);
    const bundle = builder.build();

    expect(bundle.copyBundle.map(b => b.to)).toContainEqual('app-config.yaml');
  })
});
