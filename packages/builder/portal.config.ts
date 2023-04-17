import * as path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import createFileWithContent from 'generate-file-webpack-plugin';
import RemovePlugin from 'remove-files-webpack-plugin';
import { mapEnvProperties } from './src/PortalConfiguration';
import { FilePath } from './src/FileUtils';
import { EnvironmentProperties } from './src/EnvironmentProperties';
import { buildContents, FileContent } from './src/FileContents';
import { PluginsResolver } from './src/Registry';

class PortalBundle {
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
    return buildContents(resolvePath(`bundle`), this._pluginsResolver);
  }

  applyTemplates(fileCreator: (fileContent: FileContent) => void) {
    return this.contents.map(fileCreator);
  }
}

export default (env: EnvironmentProperties) => {
  const config = mapEnvProperties(env, resolvePath);
  const bundle = new PortalBundle(
    resolvePath('bundle'),
    config.outputFolder,
    config.appConfig,
    config.pluginsResolver,
  );

  return {
    entry: path.resolve(__dirname, 'src/entrypoint.js'),
    output: {
      path: bundle.outputFolder,
    },
    mode: env.production ? 'production' : 'development',
    plugins: [
      new CopyPlugin({
        patterns: bundle.copyPatterns,
      }),
      ...bundle.applyTemplates(createFileWithContent),
      cleanup(bundle),
    ],
  };
};

function resolvePath(file: FilePath): FilePath {
  return path.resolve(__dirname, file);
}

function cleanup(bundle: PortalBundle) {
  return new RemovePlugin({
    after: {
      root: bundle.outputFolder,
      include: ['main.js'],
    },
  });
}
