import { buildPluginsResolver, PluginsResolver } from './PluginsResolver';

describe('Registry', () => {
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
            version: 'link:///foo/bar',
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

    const tpbConfig = new PluginsResolver(config, {
      resolve: name => versions[name],
      configuration: () => ({
        file: 'not relevant',
        content: 'not relevant',
      }),
    });

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
            local: false,
          },
          {
            name: 'appPlugin2',
            version: '2',
            local: false,
          },
        ],
      },
      backend: {
        plugins: [
          {
            name: 'backendPlugin1',
            version: 'link:///foo/bar',
            local: true,
            localPath: '///foo/bar',
          },
          {
            name: 'backendPlugin2',
            version: '4',
            local: false,
          },
        ],
      },
    });
  });

  it('caches the plugin versions', () => {
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
    const tpbConfig = new PluginsResolver(config, {
      resolve: () => {
        calls.count++;
        return 'foo';
      },
      configuration: () => ({
        file: 'not relevant',
        content: 'not relevant',
      }),
    });

    tpbConfig.resolve();
    tpbConfig.resolve();

    expect(calls.count).toEqual(1);
  });

  describe('the builder', () => {
    it('forces the usage of clarity theme', () => {
      const tpbConfig = buildPluginsResolver(
        {},
        {
          resolve: () => 'not relevant',
          configuration: () => ({
            file: 'not relevant',
            content: 'not relevant',
          }),
        },
      );

      const unresolvedConfig = tpbConfig.unresolvedConfig;

      expect(unresolvedConfig.app?.theme).toEqual({
        name: '@tpb/plugin-clarity-theming',
        stylesheet: '@tpb/plugin-clarity-theming/style/clarity.css',
      });
    });
  });
});
