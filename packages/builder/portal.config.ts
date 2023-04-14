import * as path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import createFileWithContent from 'generate-file-webpack-plugin';
import RemovePlugin from 'remove-files-webpack-plugin';
import { PortalBundle, PortalBundleBuilder } from './src/PortalBundleBuilder';
import {
  mapEnvProperties,
  PortalConfiguration,
} from './src/PortalConfiguration';
import { FilePath } from './src/File';
import { EnvironmentProperties } from './src/EnvironmentProperties';

export default (env: EnvironmentProperties) => {
  const config = mapEnvProperties(env, resolvePath);

  return {
    entry: path.resolve(__dirname, 'src/entrypoint.js'),
    output: {
      path: config.outputFolder,
    },
    mode: env.production ? 'production' : 'development',
    plugins: [
      copyBundle(),
      includeAppConfig(config),
      ...applyTemplates(config),
      cleanup(config),
    ],
  };
};

function resolvePath(file: FilePath): FilePath {
  return path.resolve(__dirname, file);
}

function applyTemplates(config: PortalConfiguration) {
  const builder = new PortalBundleBuilder(config);
  const bundle = builder.build();

  return bundle.contentBundle.map(createFileWithContent);
}

function copyBundle() {
  return new CopyPlugin({
    patterns: [
      {
        from: resolvePath('bundle'),
        to: '',
      },
    ],
  });
}

function includeAppConfig(config: PortalConfiguration) {
  return new CopyPlugin({
    patterns: [
      {
        from: config.appConfig,
        to: 'app-config.yaml',
      },
    ],
  });
}

function cleanup(config: PortalConfiguration) {
  return new RemovePlugin({
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
  });
}
