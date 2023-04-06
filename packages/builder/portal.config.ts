import * as webpack from 'webpack';
import * as path from 'path';
import * as CopyPlugin from 'copy-webpack-plugin';
import * as generate from 'generate-file-webpack-plugin';
import * as fs from 'fs';

// File to generate
// package.json
// yarn.lock ?

// File to replace if provided as inputs
// app-config.yaml

export default (env) => {
  const isProduction = env.production;
  return {
    entry: path.resolve(__dirname, 'src/entrypoint.js'),
    output: {
      path: path.resolve(__dirname, 'portal'),
    },
    mode: isProduction ? 'production' : 'development',
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, '../app/public'),
            to: 'packages/app/public',
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
    ],
  }
};
