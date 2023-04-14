import * as path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import createFileWithContent from 'generate-file-webpack-plugin';
import RemovePlugin from 'remove-files-webpack-plugin';
import { PortalBundleBuilder } from './src/PortalBundleBuilder';
import { mapEnvProperties } from './src/PortalConfiguration';
import { PathResolver } from './src/File';
import { EnvironmentProperties } from './src/EnvironmentProperties';

const resolvePath: PathResolver = file => path.resolve(__dirname, file);

export default (env: EnvironmentProperties) => {
  const config = mapEnvProperties(env, resolvePath);
  const builder = new PortalBundleBuilder(config);
  const bundle = builder.build();

  return {
    entry: path.resolve(__dirname, 'src/entrypoint.js'),
    output: {
      path: config.outputFolder,
    },
    mode: env.production ? 'production' : 'development',
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: resolvePath('bundle'),
            to: '',
          },
          {
            from: config.appConfig,
            to: 'app-config.yaml',
          },
        ],
      }),
      ...bundle.contentBundle.map(createFileWithContent),
      new RemovePlugin({
        after: {
          root: config.outputFolder,
          include: ['main.js', '.yarnrc.verdaccio', '.yarnrc.artifactory'],
          test: [
            {
              folder: config.outputFolder,
              method: filePath => {
                return new RegExp(/\.hbs$/, 'm').test(filePath);
              },
              recursive: true,
            },
          ],
        },
      }),
    ],
  };
};
