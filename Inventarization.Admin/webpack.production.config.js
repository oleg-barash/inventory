const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'build');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const TransferWebpackPlugin = require('transfer-webpack-plugin');

const configs = [{
  name: 'server',
    entry: [path.join(__dirname, '/src/app/server.jsx')],
    target: 'node',
    // Render source-map file for final build
    devtool: 'source-map',
    // output config
    output: {
        path: buildPath, // Path of output file
        filename: 'server.js', // Name of output file
    },
    plugins: [
        // Define production build to allow React to strip out unnecessary checks
        new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify('production'),
                'SIGNALR_HUBS_URL': JSON.stringify('http://193.124.113.47:81/signalr'),
                'PORT': 91,
                'ASSETS_URL': JSON.stringify('http://193.124.113.47:82/')
            }
        }),
        // Minify the bundle
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                // suppresses warnings, usually from module minification
                warnings: false,
            },
        }),
        // Allows error warnings but does not stop compiling.
        new webpack.NoEmitOnErrorsPlugin(),
        // Transfer Files
        new TransferWebpackPlugin([
            {from: 'www'},
        ], path.resolve(__dirname, 'src')),
    ],
    resolve: {
      extensions: ['.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/, // All .jsx files
                loaders: ['babel-loader'], // react-hot is like browser sync and babel loads jsx and es6-7
                exclude: [nodeModulesPath],
            },
        ],
    },
},{
    name: 'client',
  entry: [path.join(__dirname, '/src/app/client.jsx')],
  // Render source-map file for final build
  devtool: 'source-map',
  // output config
  output: {
    path: buildPath, // Path of output file
    filename: 'client.js', // Name of output file
  },
  plugins: [
    // Define production build to allow React to strip out unnecessary checks
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify('production'),
        'SIGNALR_HUBS_URL': JSON.stringify('http://193.124.113.47:81/signalr'),
        'API_URL': JSON.stringify('http://193.124.113.47:81/api/'),
        'ASSETS_URL': JSON.stringify('http://193.124.113.47:82/api/')
      }
    }),
    // Minify the bundle
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        // suppresses warnings, usually from module minification
        warnings: false,
      },
    }),
    // Allows error warnings but does not stop compiling.
    new webpack.NoEmitOnErrorsPlugin(),
    // Transfer Files
    new TransferWebpackPlugin([
      {from: 'www'},
    ], path.resolve(__dirname, 'src')),
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/, // All .jsx files
        loaders: ['babel-loader'], // react-hot is like browser sync and babel loads jsx and es6-7
        exclude: [nodeModulesPath],
      },
    ],
  },
}];

module.exports = configs;