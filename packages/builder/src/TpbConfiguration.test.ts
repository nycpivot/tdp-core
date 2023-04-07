type UnresolvedTpbConfiguration = {
  app: {
    plugins: {
      name: string;
      version?: string;
    }[];
  };
};

type ResolvedTpbConfiguration = {
  app: {
    plugins: {
      name: string;
      version: string;
    }[];
  };
};

type VersionResolver = (name: string) => string;

class TpbConfiguration {
  private readonly _config: UnresolvedTpbConfiguration;
  private readonly _versionResolver: VersionResolver;

  constructor(
    config: UnresolvedTpbConfiguration,
    versionResolver: VersionResolver,
  ) {
    this._config = config;
    this._versionResolver = versionResolver;
  }

  resolve(): ResolvedTpbConfiguration {
    return {
      app: {
        plugins: this._config.app.plugins.map(p => ({
          name: p.name,
          version: this._versionResolver(p.name),
        })),
      },
    };
  }
}

describe('TPB configuration', () => {
  it('resolves app plugin versions', () => {
    const config: UnresolvedTpbConfiguration = {
      app: {
        plugins: [
          {
            name: 'plugin1',
          },
          {
            name: 'plugin2',
          },
        ],
      },
    };

    const versions = { plugin1: '1', plugin2: '2' };
    const tpbConfig = new TpbConfiguration(config, name => versions[name]);
    const resolvedConfig = tpbConfig.resolve();
    expect(resolvedConfig).toEqual({
      app: {
        plugins: [
          {
            name: 'plugin1',
            version: '1',
          },
          {
            name: 'plugin2',
            version: '2',
          },
        ],
      },
    });
  });
});
