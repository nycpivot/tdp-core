import * as path from 'path';
import * as CopyPlugin from 'copy-webpack-plugin';
import * as createFileWithContent from 'generate-file-webpack-plugin';
import { PortalBundleBuilder } from './src/PortalBundleBuilder';
import { mapEnvProperties } from './src/PortalConfiguration';
import { PathResolver } from './src/FileContent';
import { EnvironmentProperties } from './src/EnvironmentProperties';

const resolvePath: PathResolver = file => path.resolve(__dirname, file);

export default (env: EnvironmentProperties) => {
  const config = mapEnvProperties(env, resolvePath);
  const builder = new PortalBundleBuilder(config);
  const bundle = builder.build();

  return {
    entry: path.resolve(__dirname, 'src/entrypoint.js'),
    output: {
      path: path.resolve(__dirname, config.outputFolder),
    },
    mode: env.production ? 'production' : 'development',
    plugins: [
      new CopyPlugin({
        patterns: bundle.copyBundle,
      }),
      ...bundle.contentBundle.map(createFileWithContent),
    ],
  };
};
