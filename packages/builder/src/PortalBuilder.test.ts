import { PortalBuilder } from './PortalBuilder';
import { PortalConfiguration } from './PortalConfiguration';

describe('Portal builder', () => {
  const config: PortalConfiguration = {
    appConfig: 'app-config.yaml',
    registry: 'remote',
    outputFolder: 'output',
    pluginsConfig: undefined,
    assetsFolder: 'src/assets',
  };

  it('provides a list of files to be copied', () => {
    const builder = new PortalBuilder(config, file => file);
    const portal = builder.build();

    expect(portal.filesToCopy.length).toBeGreaterThan(1);
  });

  it('provides a list of generated contents', () => {
    const builder = new PortalBuilder(config, file => file);
    const portal = builder.build();

    expect(portal.fileContents.length).toBeGreaterThan(1);
  });
});
