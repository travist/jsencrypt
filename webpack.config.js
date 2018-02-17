const path = require('path');
var modules_path = path.resolve(__dirname, './bin');



module.exports = {
  target: 'web',
  // devtool: 'inline-source-map',
  entry: './src/JSEncrypt.ts',
  output: {
    filename: 'jsencrypt.js',
    chunkFilename: 'modules/[chunkhash].[name].chunk.js',
    path: modules_path,
    strictModuleExceptionHandling: true
  },

  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: false,
              configFile: require.resolve("./tsconfig.json")
            }
          },
        ]
      },
    ]
  },

};