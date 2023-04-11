import * as path from 'path';
import * as CopyPlugin from 'copy-webpack-plugin';
import * as generate from 'generate-file-webpack-plugin';
import {
  CopySpecifications,
  PortalConfiguration,
} from './src/PortalConfiguration';

const resolvePath = file => path.resolve(__dirname, file);

export default env => {
  const props = { ...env, pathResolver: resolvePath };
  const portalConfiguration = PortalConfiguration.fromEnv(props);
  const copySpecifications = CopySpecifications.fromEnv(props);

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
