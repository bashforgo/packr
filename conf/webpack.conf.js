const webpack = require('webpack');
const conf = require('./gulp.conf');
const path = require('path');
const base = require('./webpack-test.conf');
const mergeWith = require('lodash/mergeWith');
const isArray = require('lodash/isArray');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = mergeWith({}, base, {
  module: {
    loaders: [
      {
        test: /\.(png|eot|woff2?|ttf|svg)$/i,
        loader: 'url-loader'
      },
      {
        test: /\.(css|scss)$/,
        loaders: [
          'style',
          'css',
          'sass',
          'postcss'
        ]
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: conf.path.src('index.html')
    }),
    new webpack.ProvidePlugin({
      'jQuery': 'jquery'
    })
  ],
  postcss: () => [autoprefixer],
  output: {
    path: path.join(process.cwd(), conf.paths.tmp),
    filename: 'index.js'
  },
  entry: `./${conf.path.src('index')}`
}, (objValue, srcValue) => {
  if (isArray(objValue)) {
    return objValue.concat(srcValue);
  }
});
