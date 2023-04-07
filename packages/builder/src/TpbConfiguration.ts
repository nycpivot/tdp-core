import { VersionResolver } from './version_resolver';

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

export class TpbConfiguration {
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
