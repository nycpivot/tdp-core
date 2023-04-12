import * as path from 'path';
import * as CopyPlugin from 'copy-webpack-plugin';
import * as generate from 'generate-file-webpack-plugin';
import { PortalConfiguration } from './src/PortalConfiguration';
import { CopySpecifications } from './src/CopySpecifications';
import { Generators } from './src/Generators';

const resolvePath = file => path.resolve(__dirname, file);

const mode = env => (env.production ? 'production' : 'development');

export default env => {
  const props = { ...env, pathResolver: resolvePath };
  const portalConfiguration = PortalConfiguration.fromEnv(props);
  const copySpecifications = CopySpecifications.fromEnv(props);
  const generators = Generators.fromEnv(props);

  return {
    entry: path.resolve(__dirname, 'src/entrypoint.js'),
    output: {
      path: path.resolve(__dirname, portalConfiguration.outputFolder),
    },
    mode: mode(env),
    plugins: [
      new CopyPlugin({
        patterns: copySpecifications.filesToCopy,
      }),
      ...generators.generators.map(f =>
        generate({ file: f.file, content: f.content }),
      ),
    ],
  };
};
