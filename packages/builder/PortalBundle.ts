import { FilePath } from './src/FileUtils';
import { PluginsResolver } from './src/Registry';
import { buildContents, FileContent } from './src/FileContents';

export class PortalBundle {
  private _outputFolder: FilePath;
  private _appConfig: FilePath;
  private _pluginsResolver: PluginsResolver;
  private _bundleFolder: FilePath;

  constructor(
    bundleFolder: FilePath,
    outputFolder: FilePath,
    appConfig: FilePath,
    pluginsResolver: PluginsResolver,
  ) {
    this._bundleFolder = bundleFolder;
    this._outputFolder = outputFolder;
    this._appConfig = appConfig;
    this._pluginsResolver = pluginsResolver;
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

  applyTemplates(fileCreator: (fileContent: FileContent) => void) {
    return buildContents(this._bundleFolder, this._pluginsResolver).map(
      fileCreator,
    );
  }
}
