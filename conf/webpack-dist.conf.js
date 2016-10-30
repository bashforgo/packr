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

const scssQuery = {
  minimize: true,
  autoprefixer: { add: true, browsers: ['> 1% in my stats'], stats: require('./stats') },
  discardComments: {
    removeAll: true
  }
};

var scssLoader = {
  loader: `css?${JSON.stringify(scssQuery)}!sass`
};

module.exports = mergeWith({}, base, {
  module: {
    loaders: [
      {
        test: /\.s?css$/,
        include: /node_modules/,
        loaders: ExtractTextPlugin.extract(scssLoader)
      },
      {
        test: /\.s?css$/,
        include: new RegExp(`${conf.paths.src}`),
        loaders: [scssLoader]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: { unused: true, dead_code: true, warnings: false }, // eslint-disable-line camelcase
      comments: false,
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
}, (objValue, srcValue) => {
  if (isArray(objValue)) {
    return objValue.concat(srcValue);
  }
});
