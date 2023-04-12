import { PortalBuilder } from './PortalBuilder';
import { PortalConfiguration } from './PortalConfiguration';

describe('Portal builder', () => {
  it('provides a list of files to be copied', () => {
    const config: PortalConfiguration = {
      appConfig: 'app-config.yaml',
      isProduction: false,
      outputFolder: 'output',
      pluginsConfig: undefined,
      readFileContent(file: string): string {
        return '';
      },
      resolvePath(file: string): string {
        return file;
      },
    };

    const builder = new PortalBuilder(config);
    const portal = builder.build();

    expect(portal.outputFolder).toEqual('output');
    expect(portal.filesToCopy.length).toBeGreaterThan(1);
    expect(portal.generatedContents.length).toBeGreaterThan(1);
  });

  it('provides proper development mode', () => {
    const config: PortalConfiguration = {
      appConfig: 'app-config.yaml',
      isProduction: false,
      outputFolder: 'output',
      pluginsConfig: undefined,
      readFileContent(file: string): string {
        return '';
      },
      resolvePath(file: string): string {
        return file;
      },
    };

    const builder = new PortalBuilder(config);
    const portal = builder.build();

    expect(portal.mode).toEqual('development');
  });

  it('provides proper production mode', () => {
    const config: PortalConfiguration = {
      appConfig: 'app-config.yaml',
      isProduction: true,
      outputFolder: 'output',
      pluginsConfig: undefined,
      readFileContent(file: string): string {
        return '';
      },
      resolvePath(file: string): string {
        return file;
      },
    };

    const builder = new PortalBuilder(config);
    const portal = builder.build();

    expect(portal.mode).toEqual('production');
  });
});
