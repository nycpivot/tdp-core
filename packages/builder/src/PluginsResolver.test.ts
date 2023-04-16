import { PluginsResolver } from './Registry';

describe('Plugins Resolver', () => {
  it('resolves plugin versions', () => {
    const config = {
      app: {
        theme: {
          name: 'theme',
          stylesheet: 'theme.css',
        },
        plugins: [
          {
            name: 'appPlugin1',
            version: 'keep',
          },
          {
            name: 'appPlugin2',
          },
        ],
      },
      backend: {
        plugins: [
          {
            name: 'backendPlugin1',
          },
          {
            name: 'backendPlugin2',
          },
        ],
      },
    };

    const versions: { [key: string]: string } = {
      appPlugin1: '1',
      appPlugin2: '2',
      backendPlugin1: '3',
      backendPlugin2: '4',
      theme: '5',
    };

    const tpbConfig = new PluginsResolver(
      config,
      name => versions[name],
      'verdaccio',
    );

    const resolvedConfig = tpbConfig.resolve();

    expect(resolvedConfig).toEqual({
      app: {
        theme: {
          name: 'theme',
          version: '5',
          stylesheet: 'theme.css',
        },
        plugins: [
          {
            name: 'appPlugin1',
            version: 'keep',
          },
          {
            name: 'appPlugin2',
            version: '2',
          },
        ],
      },
      backend: {
        plugins: [
          {
            name: 'backendPlugin1',
            version: '3',
          },
          {
            name: 'backendPlugin2',
            version: '4',
          },
        ],
      },
    });
  });

  it('caches the version', () => {
    const calls = {
      count: 0,
    };
    const config = {
      app: {
        plugins: [{ name: 'bar' }],
      },
      backend: {
        plugins: [],
      },
    };
    const tpbConfig = new PluginsResolver(
      config,
      () => {
        calls.count++;
        return 'foo';
      },
      'artifactory',
    );

    tpbConfig.resolve();
    tpbConfig.resolve();

    expect(calls.count).toEqual(1);
  });
});
