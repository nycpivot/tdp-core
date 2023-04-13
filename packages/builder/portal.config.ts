import * as path from 'path';
import * as fs from 'fs';
import * as CopyPlugin from 'copy-webpack-plugin';
import * as createFileWithContent from 'generate-file-webpack-plugin';
import { PortalBuilder } from './src/PortalBuilder';
import { mapEnvProperties } from './src/PortalConfiguration';
import { PathResolver } from './src/FileContent';

const resolvePath: PathResolver = file => path.resolve(__dirname, file);

const readFileContent = file => fs.readFileSync(resolvePath(file)).toString();

export default env => {
  const props = {
    ...env,
    pathResolver: resolvePath,
    readFileContent: readFileContent,
  };
  const config = mapEnvProperties(props);
  const builder = new PortalBuilder(config);
  const portal = builder.build(resolvePath);

  return {
    entry: path.resolve(__dirname, 'src/entrypoint.js'),
    output: {
      path: path.resolve(__dirname, config.outputFolder),
    },
    mode: 'development',
    plugins: [
      new CopyPlugin({
        patterns: portal.filesToCopy,
      }),
      ...portal.generatedContents.map(createFileWithContent),
    ],
  };
};
