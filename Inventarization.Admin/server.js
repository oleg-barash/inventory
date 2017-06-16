/**
 * Created by Барашики on 07.04.2017.
 */
require('babel-core/register');
['.css', '.less', '.sass', '.ttf', '.woff', '.woff2'].forEach((ext) => require.extensions[ext] = () => {});
require('babel-polyfill');
require('./src/app/server.jsx');