import { parse as parseYaml } from 'yaml';
import { readContent } from './FileUtils';
import { YarnResolver } from './YarnResolver';
import { FileContent } from './FileContents';

export type RegistryType = 'verdaccio' | 'artifactory';

export interface VersionResolver {
  resolve(plugin: string): string;
  configuration(): FileContent;
}

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

export class Registry {
  private readonly _config: UnresolvedPluginsConfiguration;
  private readonly _versionResolver: VersionResolver;
  private _resolvedConfig?: ResolvedPluginsConfiguration;
  private _registry: RegistryType;

  constructor(
    config: UnresolvedPluginsConfiguration,
    versionResolver: VersionResolver,
    registry: RegistryType,
  ) {
    this._config = config;
    this._versionResolver = versionResolver;
    this._registry = registry;
  }

  get registry(): RegistryType {
    return this._registry;
  }

  get unresolvedConfig(): UnresolvedPluginsConfiguration {
    return this._config;
  }

  get resolverConfiguration() {
    return this._versionResolver.configuration();
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

export function buildRegistry(
  configFile: string,
  outputFolder: string,
  registryType: RegistryType,
) {
  const yaml = parseYaml(readContent(configFile));
  // we force the theme for the moment.
  return new Registry(
    {
      app: {
        theme: {
          name: '@tpb/plugin-clarity-theme',
          stylesheet: '@tpb/plugin-clarity-theme/style/clarity.css',
        },
        plugins: yaml.app.plugins,
      },
      backend: yaml.backend,
    },
    new YarnResolver(outputFolder, registryType),
    registryType,
  );
}
