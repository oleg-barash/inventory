
const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'build');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const TransferWebpackPlugin = require('transfer-webpack-plugin');
var publicPath = 'http://localhost:8050/public'
const config = {
  // Entry points to the project
  entry: [
    'webpack/hot/only-dev-server',
    path.join(__dirname, '/src/app/client.js')
  ],
  output: {
      path: buildPath,
      filename: 'client.js',
      publicPath
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify('debug'),
        'API_URL': JSON.stringify('http://localhost/api/'),
        'ASSETS_URL': JSON.stringify(publicPath)
      }
    }),
    // Enables Hot Modules Replacement
    new webpack.HotModuleReplacementPlugin(),
    // Allows error warnings but does not stop compiling.
    new webpack.NoErrorsPlugin(),
    // Moves files
    new TransferWebpackPlugin([
      {from: 'www'},
    ], path.resolve(__dirname, 'src'))
  ],
  module: {
    loaders: [
      {
        // React-hot loader and
        test: /\.js$/, // All .js files
        loaders: ['react-hot-loader', 'babel-loader'], // react-hot is like browser sync and babel loads jsx and es6-7
        exclude: [nodeModulesPath]
      }
    ]
  }
};

module.exports = config;