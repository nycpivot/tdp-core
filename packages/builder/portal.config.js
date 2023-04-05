const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

// File to generate
// .yarnrc
// package.json
// yarn.lock ?

// File to replace if provided as inputs
// app-config.yaml

module.exports = {
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
  ],
};
