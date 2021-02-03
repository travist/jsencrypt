const path = require('path');
const packageJson = require('./package.json');
module.exports = {
  entry: path.join(path.resolve(__dirname, 'lib'), 'index.js'),
  output: {
    library: 'JSEncrypt',
    libraryTarget: 'umd',
    libraryExport: 'default',
    globalObject: 'window',
    path: path.resolve(__dirname, 'bin'),
    filename: 'jsencrypt.js',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /JSEncrypt\.js$/,
        loader: 'string-replace-loader',
        options: {
          search: 'JSENCRYPT_VERSION',
          replace: `'${packageJson.version}'`,
        }
      }
    ]
  },
  performance: { hints: false }
};