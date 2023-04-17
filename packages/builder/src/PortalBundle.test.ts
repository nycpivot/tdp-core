import { PortalBundle } from '../PortalBundle';
import { Registry } from './Registry';

describe('Portal Bundle', () => {
  it('generates copy patterns', () => {
    const bundle = new PortalBundle(
      'foo/bar',
      '/output',
      '/config/app-config.yaml',
      new Registry(
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
        'verdaccio',
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
      from: '/config/app-config.yaml',
      to: 'app-config.yaml',
    });
  });

  it('apply templates', () => {
    const bundle = new PortalBundle(
      'bundle',
      '/output',
      '/config/app-config.yaml',
      new Registry(
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
        'verdaccio',
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
