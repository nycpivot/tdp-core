import { FilePath } from './FileUtils';
import { PluginsResolver } from './PluginsResolver';
import { buildContents, FileContent } from './FileContents';

export class PortalBundle {
  private readonly _outputFolder: FilePath;
  private readonly _appConfig: FilePath;
  private readonly _buildAppConfig: FilePath;
  private readonly _registry: PluginsResolver;
  private readonly _bundleFolder: FilePath;

  constructor(
    bundleFolder: FilePath,
    outputFolder: FilePath,
    appConfig: FilePath,
    buildAppConfig: FilePath,
    registry: PluginsResolver,
  ) {
    this._bundleFolder = bundleFolder;
    this._outputFolder = outputFolder;
    this._appConfig = appConfig;
    this._buildAppConfig = buildAppConfig;
    this._registry = registry;
  }

  get copyPatterns() {
    return [
      {
        from: this._bundleFolder,
        to: '',
        globOptions: {
          ignore: ['**.hbs', '**.verdaccio', '**.artifactory'],
        },
      },
      {
        from: this._appConfig,
        to: 'runtime-config.yaml',
      },
      {
        from: this._buildAppConfig,
        to: 'app-config.yaml',
      },
    ];
  }

  get outputFolder() {
    return this._outputFolder;
  }

  get appConfig() {
    return this._appConfig;
  }

  get buildAppConfig() {
    return this._buildAppConfig;
  }

  get bundleFolder() {
    return this._bundleFolder;
  }

  get registry() {
    return this._registry;
  }

  applyTemplates(fileCreator: (fileContent: FileContent) => void) {
    return buildContents(this._bundleFolder, this._registry).map(fileCreator);
  }
}
