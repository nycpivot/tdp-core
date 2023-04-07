import * as path from 'path';
import * as CopyPlugin from 'copy-webpack-plugin';
import * as generate from 'generate-file-webpack-plugin';
import * as fs from 'fs';
import { parse as parseYaml } from 'yaml';
import { compile } from 'handlebars';
import { TpbConfiguration } from './src/TpbConfiguration';
import { yarnResolver } from './src/version_resolver';

// File to generate
// package.json
// yarn.lock ?

// File to replace if provided as inputs
// app-config.yaml

const template = file => {
  return compile(fs.readFileSync(path.resolve(__dirname, file)).toString());
};

export default env => {
  const isProduction = env.production;
  const configFile =
    env.tpb_config || path.resolve(__dirname, 'conf/tpb-config.yaml');
  const outputFolder = env.output_folder || 'portal';
  const config = new TpbConfiguration(
    parseYaml(fs.readFileSync(configFile).toString('utf-8')),
    yarnResolver(outputFolder),
  );
  return {
    entry: path.resolve(__dirname, 'src/entrypoint.js'),
    output: {
      path: path.resolve(__dirname, outputFolder),
    },
    mode: isProduction ? 'production' : 'development',
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, '../app/.eslintrc.js'),
            to: 'packages/app/.eslintrc.js',
          },
          {
            from: path.resolve(__dirname, '../backend/.eslintrc.js'),
            to: 'packages/backend/.eslintrc.js',
          },
          {
            from: path.resolve(__dirname, '../app/public'),
            to: 'packages/app/public',
          },
          {
            from: path.resolve(__dirname, '../../package.json'),
            to: 'package.json',
          },
          {
            from: path.resolve(__dirname, '../../tsconfig.json'),
            to: 'tsconfig.json',
          },
          {
            from: path.resolve(__dirname, '../../backstage.json'),
            to: 'backstage.json',
          },
          {
            from: path.resolve(__dirname, '../../app-config.yaml'),
            to: 'app-config.yaml',
          },
        ],
      }),
      generate({
        file: '.yarnrc',
        content: isProduction
          ? fs.readFileSync(path.resolve(__dirname, 'assets/.yarnrc'))
          : fs.readFileSync(path.resolve(__dirname, '../../.yarnrc')),
      }),
      generate({
        file: 'packages/app/src/index.ts',
        content: () => {
          return template('assets/packages/app/src/index.ts.hbs')(
            config.resolve(),
          );
        },
      }),
      generate({
        file: 'packages/app/package.json',
        content: () => {
          return template('assets/packages/app/package.json.hbs')(
            config.resolve(),
          );
        },
      }),
      generate({
        file: 'packages/backend/src/index.ts',
        content: () => {
          return template('assets/packages/backend/src/index.ts.hbs')(
            config.resolve(),
          );
        },
      }),
      generate({
        file: 'packages/backend/package.json',
        content: () => {
          return template('assets/packages/backend/package.json.hbs')(
            config.resolve(),
          );
        },
      }),
    ],
  };
};
