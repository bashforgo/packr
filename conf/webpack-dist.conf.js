const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const mergeWith = require('lodash/mergeWith');
const isArray = require('lodash/isArray');

const conf = require('./gulp.conf');
const base = require('./webpack.conf');

base.module.loaders.pop();
base.module.loaders.pop();

base.plugins.pop();
base.plugins.pop();

module.exports = mergeWith({}, base, {
  module: {
    loaders: [
      {
        test: /\.(css|scss)$/,
        include: /node_modules/,
        loaders: ExtractTextPlugin.extract({
          loader: 'css?minimize!postcss'
        })
      },
      {
        test: /\.s?css$/,
        include: new RegExp(`${conf.paths.src}`),
        loaders: [
          'css?minimize',
          'postcss',
          'sass'
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: { unused: true, dead_code: true, warnings: false }, // eslint-disable-line camelcase
      sourceMap: true
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
    })
  ],
  output: {
    filename: '[name].[chunkhash].js',
    path: path.join(process.cwd(), conf.paths.dist),
    sourceMapFilename: 'maps/[file].map'
  },
  postcss: () => [autoprefixer]
}, (objValue, srcValue) => {
  if (isArray(objValue)) {
    return objValue.concat(srcValue);
  }
});
