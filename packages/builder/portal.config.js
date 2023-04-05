const path = require('path');
const fs = require('fs');
const generate = require('generate-file-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

// Files to copy
// app-config.yaml
// tsconfig.json

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
          from: path.resolve(__dirname, '../../backstage.json'),
          to: 'backstage.json',
        },
      ],
    }),
  ],
};
