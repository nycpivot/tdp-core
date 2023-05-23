import { FileContent } from './FileContents';

export interface VersionResolver {
  resolve(plugin: string): string;
  configuration(): FileContent;
}

export type UnresolvedPlugins = {
  app?: {
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
  backend?: {
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

type ResolvedPlugins = {
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
  private readonly _config: UnresolvedPlugins;
  private readonly _versionResolver: VersionResolver;
  private _resolvedConfig?: ResolvedPlugins;

  constructor(config: UnresolvedPlugins, versionResolver: VersionResolver) {
    this._config = config;
    this._versionResolver = versionResolver;
  }

  get unresolvedConfig(): UnresolvedPlugins {
    return this._config;
  }

  get resolverConfiguration() {
    return this._versionResolver.configuration();
  }

  resolve(): ResolvedPlugins {
    if (this._resolvedConfig) {
      return this._resolvedConfig;
    }
    this._resolvedConfig = {
      app: {
        plugins: this._config.app
          ? this.resolvePlugins(this._config.app.plugins)
          : [],
      },
      backend: {
        plugins: this._config.backend
          ? this.resolvePlugins(this._config.backend.plugins)
          : [],
      },
    };

    if (this._config.app?.theme) {
      this._resolvedConfig.app.theme = {
        name: this._config.app.theme.name,
        version: this.resolvePluginVersion(this._config.app.theme.name),
        stylesheet: this._config.app.theme.stylesheet,
      };
    }

    return this._resolvedConfig;
  }

  private resolvePluginVersion(pluginName: string) {
    return this._versionResolver.resolve(pluginName);
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

export function buildPluginsResolver(
  tpbConfig: UnresolvedPlugins,
  resolver: VersionResolver,
) {
  // we force the theme for the moment.
  return new PluginsResolver(
    {
      app: {
        theme: {
          name: '@tpb/plugin-clarity-theming',
          stylesheet: '@tpb/plugin-clarity-theming/style/clarity.css',
        },
        plugins: tpbConfig.app ? tpbConfig.app.plugins : [],
      },
      backend: tpbConfig.backend,
    },
    resolver,
  );
}
