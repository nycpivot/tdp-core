import * as path from 'path';
import * as CopyPlugin from 'copy-webpack-plugin';
import * as createFileWithContent from 'generate-file-webpack-plugin';
import { PortalBuilder } from './src/PortalBuilder';
import { mapEnvProperties } from './src/PortalConfiguration';

const resolvePath = file => path.resolve(__dirname, file);

export default env => {
  const props = { ...env, pathResolver: resolvePath };
  const config = mapEnvProperties(props);
  const builder = new PortalBuilder(config);
  const portal = builder.build();

  return {
    entry: path.resolve(__dirname, 'src/entrypoint.js'),
    output: {
      path: path.resolve(__dirname, portal.outputFolder),
    },
    mode: portal.mode,
    plugins: [
      new CopyPlugin({
        patterns: portal.filesToCopy,
      }),
      ...portal.generatedContents.map(createFileWithContent),
    ],
  };
};
