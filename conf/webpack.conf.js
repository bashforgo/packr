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
    new webpack.ProgressPlugin(function defaultHandler(percentage, msg) {
      var details = Array.prototype.slice.call(arguments, 2);
      if(percentage < 1) {
        percentage = Math.floor(percentage * 100);
        msg = percentage + "% " + msg;
        if(percentage < 100) {
          msg = " " + msg;
        }
        if(percentage < 10) {
          msg = " " + msg;
        }
        details.forEach(function(detail) {
          if(!detail) return;
          msg += " " + detail
        });
      }
      process.stderr.write(msg + '\n');
    }),
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
