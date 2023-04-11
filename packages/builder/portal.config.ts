import * as path from 'path';
import * as CopyPlugin from 'copy-webpack-plugin';
import * as generate from 'generate-file-webpack-plugin';
import { PortalConfiguration, prepareData } from './src/PortalConfiguration';

export default env => {
  const portalConfiguration = PortalConfiguration.fromEnv(env);
  const data = prepareData(portalConfiguration);

  return {
    entry: path.resolve(__dirname, 'src/entrypoint.js'),
    output: {
      path: path.resolve(__dirname, portalConfiguration.outputFolder),
    },
    mode: portalConfiguration.isProduction ? 'production' : 'development',
    plugins: [
      new CopyPlugin({
        patterns: data.filesToCopy,
      }),
      ...data.fileContents.map(f =>
        generate({ file: f.file, content: f.content }),
      ),
    ],
  };
};
