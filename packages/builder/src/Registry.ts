import { execSync } from 'child_process';

export type Registry = 'verdaccio' | 'artifactory';
export type VersionResolver = (name: string) => string;

export const yarnResolver = (yarnRcFolder: string) => {
  return (name: string) => {
    return execSync(`yarn info --cwd ${yarnRcFolder} -s ${name} version`)
      .toString('utf-8')
      .trim();
  };
};

type UnresolvedPluginsConfiguration = {
  app: {
    theme?: {
      name: string;
      version?: string;
      stylesheet?: string;
    };
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

type Plugin = {
  name: string;
  version: string;
  local: false;
};

type LocalPlugin = {
  name: string;
  version: string;
  local: true;
  localPath: string;
};

type ResolvedPluginsConfiguration = {
  app: {
    theme?: {
      name: string;
      version: string;
      stylesheet?: string;
    };
    plugins: (Plugin | LocalPlugin)[];
  };
  backend: {
    plugins: (Plugin | LocalPlugin)[];
  };
};

export class PluginsResolver {
  private readonly _config: UnresolvedPluginsConfiguration;
  private readonly _versionResolver: VersionResolver;
  private _resolvedConfig?: ResolvedPluginsConfiguration;
  private _registry: Registry;

  constructor(
    config: UnresolvedPluginsConfiguration,
    versionResolver: VersionResolver,
    registry: Registry,
  ) {
    this._config = config;
    this._versionResolver = versionResolver;
    this._registry = registry;
  }

  get registry(): Registry {
    return this._registry;
  }

  resolve(): ResolvedPluginsConfiguration {
    if (this._resolvedConfig) {
      return this._resolvedConfig;
    }
    this._resolvedConfig = {
      app: {
        plugins: this.resolvePlugins(this._config.app.plugins),
      },
      backend: {
        plugins: this.resolvePlugins(this._config.backend.plugins),
      },
    };

    if (this._config.app.theme) {
      this._resolvedConfig.app.theme = {
        name: this._config.app.theme.name,
        version: this.resolvePluginVersion(this._config.app.theme.name),
        stylesheet: this._config.app.theme.stylesheet,
      };
    }

    return this._resolvedConfig;
  }

  private resolvePluginVersion(pluginName: string) {
    return this._versionResolver(pluginName);
  }

  private resolvePlugin(p: {
    name: string;
    version?: string;
  }): Plugin | LocalPlugin {
    if (p.version && p.version.startsWith('link:')) {
      return {
        name: p.name,
        version: p.version ? p.version : this.resolvePluginVersion(p.name),
        local: true,
        localPath: p.version.substring('link:'.length),
      };
    }
    return {
      name: p.name,
      version: p.version ? p.version : this.resolvePluginVersion(p.name),
      local: false,
    };
  }

  private resolvePlugins(plugins: { name: string; version?: string }[]) {
    return plugins.map(p => this.resolvePlugin(p));
  }
}
