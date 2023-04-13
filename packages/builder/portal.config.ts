import * as path from 'path';
import * as CopyPlugin from 'copy-webpack-plugin';
import * as createFileWithContent from 'generate-file-webpack-plugin';
import { PortalBuilder } from './src/PortalBuilder';
import { mapEnvProperties } from './src/PortalConfiguration';
import { PathResolver } from './src/FileContent';
import { EnvironmentProperties } from './src/EnvironmentProperties';

const resolvePath: PathResolver = file => path.resolve(__dirname, file);

export default (env: EnvironmentProperties) => {
  const config = mapEnvProperties(env, resolvePath);
  const builder = new PortalBuilder(config);
  const portal = builder.build(resolvePath);

  return {
    entry: path.resolve(__dirname, 'src/entrypoint.js'),
    output: {
      path: path.resolve(__dirname, config.outputFolder),
    },
    mode: env.production ? 'production' : 'development',
    plugins: [
      new CopyPlugin({
        patterns: portal.filesToCopy,
      }),
      ...portal.fileContents.map(createFileWithContent),
    ],
  };
};
