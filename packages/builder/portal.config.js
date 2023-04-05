const path = require('path');
const fs = require('fs');
const generate = require('generate-file-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src/entrypoint.js'),
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    generate({
      file: path.resolve(__dirname, 'dist/backstage.json'),
      content:
          fs.readFileSync(path.resolve(__dirname, '../../backstage.json'))
    })
  ]
};
