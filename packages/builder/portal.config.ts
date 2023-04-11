import * as path from 'path';
import * as CopyPlugin from 'copy-webpack-plugin';
import * as generate from 'generate-file-webpack-plugin';
import {
  PortalConfiguration,
} from './src/PortalConfiguration';
import { CopySpecifications } from './src/CopySpecifications';
import {ContentGenerators} from "./src/ContentGenerators";

const resolvePath = file => path.resolve(__dirname, file);

export default env => {
  const props = { ...env, pathResolver: resolvePath };
  const portalConfiguration = PortalConfiguration.fromEnv(props);
  const copySpecifications = CopySpecifications.fromEnv(props);
  const contentGenerators = ContentGenerators.fromEnv(props);

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
      ...contentGenerators.generators.map(f =>
        generate({ file: f.file, content: f.content }),
      ),
      ...portalConfiguration.generators.map(f =>
        generate({ file: f.file, content: f.content }),
      ),
    ],
  };
};
