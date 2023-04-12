import * as path from 'path';
import * as CopyPlugin from 'copy-webpack-plugin';
import * as generate from 'generate-file-webpack-plugin';
import { PortalBuilder } from './src/PortalBuilder';

const resolvePath = file => path.resolve(__dirname, file);

const mode = env => (env.production ? 'production' : 'development');

export default env => {
  const props = { ...env, pathResolver: resolvePath };
  const portalBuilder = PortalBuilder.fromEnv(props);

  return {
    entry: path.resolve(__dirname, 'src/entrypoint.js'),
    output: {
      path: path.resolve(__dirname, portalBuilder.outputFolder),
    },
    mode: mode(env),
    plugins: [
      new CopyPlugin({
        patterns: portalBuilder.copyPatterns,
      }),
      ...portalBuilder.generate().map(f =>
        generate({ file: f.file, content: f.content }),
      ),
    ],
  };
};
