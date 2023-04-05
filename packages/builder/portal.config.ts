import * as webpack from 'webpack';
import * as path from 'path';
import * as CopyPlugin from 'copy-webpack-plugin';
import * as generate from 'generate-file-webpack-plugin'
import {PortalBuilderPlugin} from "./src/index";

// File to generate
// .yarnrc
// package.json
// yarn.lock ?

// File to replace if provided as inputs
// app-config.yaml

const config: webpack.Configuration = {
  entry: path.resolve(__dirname, 'src/entrypoint.js'),
  output: {
    path: path.resolve(__dirname, 'portal'),
  },
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
    generate(
      {
        file: '.yarnrc',
        content: 'registry "http://localhost:4873"'
      }
    ),
    new PortalBuilderPlugin(),
  ],
};

export default config;
