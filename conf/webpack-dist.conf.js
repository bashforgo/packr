const webpack = require('webpack');
const path = require('path');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const mergeWith = require('lodash/mergeWith');
const isArray = require('lodash/isArray');

const conf = require('./gulp.conf');
const base = require('./webpack.conf');

base.module.loaders.pop();
base.module.loaders.push({
  test: /\.(css|scss)$/,
  loaders: ExtractTextPlugin.extract({
    fallbackLoader: 'style',
    loader: 'css?minimize!sass!postcss'
  })
});

base.plugins.pop();
base.plugins.pop();

module.exports = mergeWith({}, base, {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {unused: true, dead_code: true, warnings: false} // eslint-disable-line camelcase
    }),
    new ExtractTextPlugin('[name].[contenthash].css'),
    new FaviconsWebpackPlugin({
      logo: `./${conf.path.src('assets', 'favicon.png')}`,
      prefix: 'icons/',
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: false,
        coast: false,
        favicons: true,
        firefox: false,
        opengraph: true,
        twitter: false,
        yandex: false,
        windows: false
      }
    }),
    new CleanWebpackPlugin(conf.paths.dist, {
      root: process.cwd(),
      verbose: true
    })
  ],
  output: {
    path: path.join(process.cwd(), conf.paths.dist),
    sourceMapFilename: 'maps/[file].map'
  }
}, (objValue, srcValue) => {
  if (isArray(objValue)) {
    return objValue.concat(srcValue);
  }
});
