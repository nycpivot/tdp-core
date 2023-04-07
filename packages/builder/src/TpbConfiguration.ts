import { VersionResolver } from './version_resolver';

type UnresolvedTpbConfiguration = {
  theme?: {
    name: string;
    version?: string;
    stylesheet?: string;
  };
  app: {
    plugins: {
      name: string;
      version?: string;
    }[];
  };
  backend: {
    plugins: {
      name: string;
      version?: string;
    }[];
  };
};

type ResolvedTpbConfiguration = {
  theme?: {
    name: string;
    version: string;
    stylesheet?: string;
  };
  app: {
    plugins: {
      name: string;
      version: string;
    }[];
  };
  backend: {
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
    const resolvedConfig: ResolvedTpbConfiguration = {
      app: {
        plugins: this.resolvePlugins(this._config.app.plugins),
      },
      backend: {
        plugins: this.resolvePlugins(this._config.backend.plugins),
      },
    };

    if (this._config.theme) {
      resolvedConfig.theme = {
        name: this._config.theme.name,
        version: this.resolvePluginVersion(this._config.theme.name),
        stylesheet: this._config.theme.stylesheet,
      };
    }

    return resolvedConfig;
  }

  private resolvePluginVersion(pluginName: string) {
    return this._versionResolver(pluginName);
  }

  private resolvePlugins(plugins: { name: string; version?: string }[]) {
    return plugins.map(p => ({
      name: p.name,
      version: this.resolvePluginVersion(p.name),
    }));
  }
}
