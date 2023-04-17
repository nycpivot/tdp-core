import * as path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import createFileWithContent from 'generate-file-webpack-plugin';
import RemovePlugin from 'remove-files-webpack-plugin';
import { buildPortalBundle } from './src/PortalConfiguration';
import { FilePath } from './src/FileUtils';
import { EnvironmentProperties } from './src/EnvironmentProperties';
import { PortalBundle } from './PortalBundle';

export default (env: EnvironmentProperties) => {
  const bundle = buildPortalBundle(env, resolvePath);

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
