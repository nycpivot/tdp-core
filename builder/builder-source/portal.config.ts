import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import RemovePlugin from 'remove-files-webpack-plugin';
import { buildPortalBundle } from './src/PortalBundleBuilder';
import { FilePath } from './src/FileUtils';
import { EnvironmentProperties } from './src/EnvironmentProperties';

const createFile = require('generate-file-webpack-plugin');

export default (env: EnvironmentProperties) => {
  const bundle = buildPortalBundle(env, resolvePath);

  return {
    entry: path.resolve(__dirname, 'src/entrypoint.js'),
    output: {
      path: bundle.outputFolder,
    },
    mode: 'production',
    plugins: [
      new CopyPlugin({
        patterns: bundle.copyPatterns,
      }),
      ...bundle.applyTemplates(createFile),
      new RemovePlugin({
        after: {
          root: bundle.outputFolder,
          include: ['main.js'],
        },
      }),
    ],
  };
};

function resolvePath(file: FilePath): FilePath {
  return path.resolve(__dirname, file);
}
