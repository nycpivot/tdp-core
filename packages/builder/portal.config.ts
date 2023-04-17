import * as path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import createFileWithContent from 'generate-file-webpack-plugin';
import RemovePlugin from 'remove-files-webpack-plugin';
import { mapEnvProperties } from './src/PortalConfiguration';
import { FilePath } from './src/FileUtils';
import { EnvironmentProperties } from './src/EnvironmentProperties';
import { buildContents } from './src/FileContents';
import { FileContent } from './src/FileContents';

type PortalBundle = {
  outputFolder: string;
  appConfig: FilePath;
  contents: FileContent[];
};

export default (env: EnvironmentProperties) => {
  const config = mapEnvProperties(env, resolvePath);
  const bundle: PortalBundle = {
    outputFolder: config.outputFolder,
    appConfig: config.appConfig,
    contents: buildContents(resolvePath(`bundle`), config.pluginsResolver),
  };

  return {
    entry: path.resolve(__dirname, 'src/entrypoint.js'),
    output: {
      path: bundle.outputFolder,
    },
    mode: env.production ? 'production' : 'development',
    plugins: [
      copyBundle(),
      includeAppConfig(bundle),
      ...applyTemplates(bundle),
      cleanup(bundle),
    ],
  };
};

function resolvePath(file: FilePath): FilePath {
  return path.resolve(__dirname, file);
}

function applyTemplates(bundle: PortalBundle) {
  return bundle.contents.map(createFileWithContent);
}

function copyBundle() {
  return new CopyPlugin({
    patterns: [
      {
        from: resolvePath('bundle'),
        to: '',
        globOptions: {
          ignore: ['**.hbs', '**.verdaccio', '**.artifactory'],
        },
      },
    ],
  });
}

function includeAppConfig(bundle: PortalBundle) {
  return new CopyPlugin({
    patterns: [
      {
        from: bundle.appConfig,
        to: 'app-config.yaml',
      },
    ],
  });
}

function cleanup(bundle: PortalBundle) {
  return new RemovePlugin({
    after: {
      root: bundle.outputFolder,
      include: ['main.js'],
    },
  });
}
