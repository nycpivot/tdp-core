import * as webpack from 'webpack';
import * as path from 'path';
import * as CopyPlugin from 'copy-webpack-plugin';
import * as generate from 'generate-file-webpack-plugin'
import {PortalBuilderPlugin} from "./src/index";

// File to generate
// package.json
// yarn.lock ?

// File to replace if provided as inputs
// app-config.yaml

const isProduction = process.env.NODE_ENV === 'production';

const config: webpack.Configuration = {
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
    generate(
      {
        file: '.yarnrc',
        content: isProduction ? 'registry "http://localhost:4873"' : '"@tpb:registry" "https://artifactory.eng.vmware.com/artifactory/api/npm/tpb-npm-local/"\n' +
          'registry "https://build-artifactory.eng.vmware.com/artifactory/api/npm/npm/"\n'
      }
    ),
    new PortalBuilderPlugin(),
  ],
};

export default config;
