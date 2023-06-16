import { PortalBundle } from './PortalBundle';
import { PluginsResolver } from './PluginsResolver';

describe('Portal Bundle', () => {
  it('generates copy patterns', () => {
    const bundle = new PortalBundle(
      'foo/bar',
      '/output',
      '/runtime/app-config.yaml',
      '/buildtime/app-config.yaml',
      new PluginsResolver(
        {
          app: {
            plugins: [],
          },
          backend: {
            plugins: [],
          },
        },
        {
          resolve: () => 'not relevant',
          configuration: () => ({ file: '.yarnrc', content: 'not relevant' }),
        },
      ),
    );

    expect(bundle.copyPatterns).toContainEqual({
      from: 'foo/bar',
      to: '',
      globOptions: {
        ignore: ['**.hbs', '**.verdaccio', '**.artifactory'],
      },
    });

    expect(bundle.copyPatterns).toContainEqual({
      from: '/runtime/app-config.yaml',
      to: 'runtime-config.yaml',
    });

    expect(bundle.copyPatterns).toContainEqual({
      from: '/buildtime/app-config.yaml',
      to: 'app-config.yaml',
    });
  });

  it('apply templates', () => {
    const bundle = new PortalBundle(
      'bundle',
      '/output',
      '/config/app-config.yaml',
      '/config/app-config.yaml',
      new PluginsResolver(
        {
          app: {
            plugins: [],
          },
          backend: {
            plugins: [],
          },
        },
        {
          resolve: () => 'not relevant',
          configuration: () => ({ file: '.yarnrc', content: 'not relevant' }),
        },
      ),
    );

    const contents: string[] = [];

    bundle.applyTemplates(fileContent => {
      contents.push(fileContent.file);
    });

    expect(contents).toHaveLength(6);
    expect(contents).toContainEqual('.yarnrc');
    expect(contents).toContainEqual('package.json');
    expect(contents).toContainEqual('packages/app/package.json');
    expect(contents).toContainEqual('packages/app/src/index.ts');
    expect(contents).toContainEqual('packages/backend/package.json');
    expect(contents).toContainEqual('packages/backend/src/index.ts');
  });
});
