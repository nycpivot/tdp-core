import { FilePath } from './src/FileUtils';
import { Registry } from './src/Registry';
import { buildContents, FileContent } from './src/FileContents';

export class PortalBundle {
  private readonly _outputFolder: FilePath;
  private readonly _appConfig: FilePath;
  private readonly _registry: Registry;
  private readonly _bundleFolder: FilePath;

  constructor(
    bundleFolder: FilePath,
    outputFolder: FilePath,
    appConfig: FilePath,
    registry: Registry,
  ) {
    this._bundleFolder = bundleFolder;
    this._outputFolder = outputFolder;
    this._appConfig = appConfig;
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
