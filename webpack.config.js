const path = require('path');
var modules_path = path.resolve(__dirname, './test');



module.exports = {
  target: 'web',
  devtool: 'inline-source-map',
  entry: './test/test.rsa.js',
  output: {
    filename: 'bundle.js',
    chunkFilename: 'modules/[chunkhash].[name].chunk.js',
    path: modules_path,
    strictModuleExceptionHandling: true
  },

  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.js']
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.tsx?$/
      },
    ]
  },
};