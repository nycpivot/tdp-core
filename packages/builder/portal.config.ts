import * as path from 'path';
import * as CopyPlugin from 'copy-webpack-plugin';
import * as generate from 'generate-file-webpack-plugin';
import {
  CopySpecifications,
  PortalConfiguration,
} from './src/PortalConfiguration';

export default env => {
  const portalConfiguration = PortalConfiguration.fromEnv(env);
  const copySpecifications = CopySpecifications.fromEnv(env);

  return {
    entry: path.resolve(__dirname, 'src/entrypoint.js'),
    output: {
      path: path.resolve(__dirname, portalConfiguration.outputFolder),
    },
    mode: portalConfiguration.mode,
    plugins: [
      new CopyPlugin({
        patterns: copySpecifications.filesToCopy,
      }),
      ...portalConfiguration.fileGenerators.map(f =>
        generate({ file: f.file, content: f.content }),
      ),
    ],
  };
};
