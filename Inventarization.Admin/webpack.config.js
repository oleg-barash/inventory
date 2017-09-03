
const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'build');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const TransferWebpackPlugin = require('transfer-webpack-plugin');
var publicPath = 'http://localhost:8050/public'
const config = {
  entry: [
    'webpack/hot/only-dev-server',
    path.join(__dirname, '/src/app/client.jsx')
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
        'SIGNALR_HUBS_URL': JSON.stringify('http://localhost/signalr/hubs'),
        'API_URL': JSON.stringify('http://localhost/api/'),
        'ASSETS_URL': JSON.stringify(publicPath)
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new TransferWebpackPlugin([
      {from: 'www'},
    ], path.resolve(__dirname, 'src'))
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx|\.js$/,
        loaders: ['react-hot-loader', 'babel-loader'], // react-hot is like browser sync and babel loads jsx and es6-7
        exclude: [nodeModulesPath]
      }
    ]
  }
};

module.exports = config;