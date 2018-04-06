const path = require('path');


module.exports = {
  mode: 'production',
  entry: {
    'slice.min': './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, './lib'),
    filename: '[name].js',
    libraryTarget: 'umd',
  },
  module: {
    rules: [{
      test: /.js$/,
      use: ['babel-loader'],
    }],
  },
};
