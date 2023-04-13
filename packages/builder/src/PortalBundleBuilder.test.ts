import { PortalBundleBuilder } from './PortalBundleBuilder';
import { PortalConfiguration } from './PortalConfiguration';
import { PluginsResolver } from './PluginsResolver';

describe('Portal bundle builder', () => {
  const config: PortalConfiguration = {
    appConfig: 'app-config.yaml',
    registry: 'remote',
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
      files: [
        {
          name: 'package.json',
          template: 'src/assets/packages/app/package.json.hbs',
        },
        {
          name: 'eslint.rc',
          copy: '../../eslint.rc',
        },
      ],
    },
  };

  it('provides a list of files to be copied', () => {
    const builder = new PortalBundleBuilder(config, file => file);
    const bundle = builder.build();

    expect(bundle.copyBundle.length).toBeGreaterThan(1);
  });

  it('provides a list of generated contents', () => {
    const builder = new PortalBundleBuilder(config, file => file);
    const bundle = builder.build();

    expect(bundle.contentBundle.length).toBeGreaterThan(1);
  });
});
