import { PortalBuilder } from './PortalBuilder';
import { PortalConfiguration } from './PortalConfiguration';

describe('Portal builder', () => {
  const config: PortalConfiguration = {
    appConfig: 'app-config.yaml',
    registry: 'remote',
    outputFolder: 'output',
    pluginsConfig: undefined,
    readFileContent(file: string): string {
      return '';
    },
  };

  it('provides a list of files to be copied', () => {
    const builder = new PortalBuilder(config);
    const portal = builder.build(file => file);

    expect(portal.filesToCopy.length).toBeGreaterThan(1);
  });

  it('provides a list of generated contents', () => {
    const builder = new PortalBuilder(config);
    const portal = builder.build(file => file);

    expect(portal.generatedContents.length).toBeGreaterThan(1);
  });
});
