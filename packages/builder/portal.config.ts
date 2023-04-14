import * as path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import createFileWithContent from 'generate-file-webpack-plugin';
import RemovePlugin from 'remove-files-webpack-plugin';
import {
  mapEnvProperties,
  PortalConfiguration,
} from './src/PortalConfiguration';
import {
  FileContent,
  FilePath,
  findInDir,
  RawContent,
  readContent,
} from './src/FileUtils';
import { EnvironmentProperties } from './src/EnvironmentProperties';
import { compile } from 'handlebars';

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

function generate(template: RawContent, config: any) {
  return compile(template)(config);
}

function applyTemplates(config: PortalConfiguration) {
  const contents: FileContent[] = [];

  contents.push({
    file: '.yarnrc',
    content: readContent(resolvePath(`bundle/.yarnrc.${config.registry}`)),
  });

  const templates = findInDir(resolvePath('bundle'), /\.hbs$/);
  templates.forEach(t => {
    contents.push({
      file: t
        .replace(path.join(__dirname, 'bundle'), config.outputFolder)
        .replace('.hbs', ''),
      content: () => generate(readContent(t), config.pluginsResolver.resolve()),
    });
  });

  return contents.map(createFileWithContent);
}

function copyBundle() {
  return new CopyPlugin({
    patterns: [
      {
        from: resolvePath('bundle'),
        to: '',
        globOptions: {
          ignore: ['**.hbs', '**.verdaccio', '**.artifactory'],
        },
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
      include: ['main.js'],
    },
  });
}
