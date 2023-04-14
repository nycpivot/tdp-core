import * as path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import createFileWithContent from 'generate-file-webpack-plugin';
import RemovePlugin from 'remove-files-webpack-plugin';
import {
  mapEnvProperties,
  PortalConfiguration,
} from './src/PortalConfiguration';
import { FilePath } from './src/FileUtils';
import { EnvironmentProperties } from './src/EnvironmentProperties';
import { prepareContents } from './src/FileContents';

export default (env: EnvironmentProperties) => {
  const config = mapEnvProperties(env, resolvePath);

  return {
    entry: path.resolve(__dirname, 'src/entrypoint.js'),
    output: {
      path: config.outputFolder,
    },
    mode: env.production ? 'production' : 'development',
    plugins: [
      copyBundle(),
      includeAppConfig(config),
      ...applyTemplates(config),
      cleanup(config),
    ],
  };
};

function resolvePath(file: FilePath): FilePath {
  return path.resolve(__dirname, file);
}

function applyTemplates(config: PortalConfiguration) {
  const bundleFolder = resolvePath(`bundle`);
  return prepareContents(bundleFolder, config.pluginsResolver).map(
    createFileWithContent,
  );
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

function includeAppConfig(config: PortalConfiguration) {
  return new CopyPlugin({
    patterns: [
      {
        from: config.appConfig,
        to: 'app-config.yaml',
      },
    ],
  });
}

function cleanup(config: PortalConfiguration) {
  return new RemovePlugin({
    after: {
      root: config.outputFolder,
      include: ['main.js'],
    },
  });
}
