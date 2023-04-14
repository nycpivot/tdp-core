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
    },
  };

  it('provides a list of generated contents', () => {
    const builder = new PortalBundleBuilder(config);
    const bundle = builder.build();

    expect(bundle.contentBundle.length).toBeGreaterThan(1);
  });
});
