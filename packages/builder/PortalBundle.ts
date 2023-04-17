import { FilePath } from './src/FileUtils';
import { PluginsResolver } from './src/Registry';
import { buildContents, FileContent } from './src/FileContents';

export class PortalBundle {
  private _outputFolder: string;
  private _appConfig: FilePath;
  private _pluginsResolver: PluginsResolver;
  private _bundleFolder: string;

  constructor(
    bundleFolder: string,
    outputFolder: string,
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

  get contents() {
    return buildContents(this._bundleFolder, this._pluginsResolver);
  }

  applyTemplates(fileCreator: (fileContent: FileContent) => void) {
    return this.contents.map(fileCreator);
  }
}
