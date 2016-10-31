const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const mergeWith = require('lodash/mergeWith');
const isArray = require('lodash/isArray');
const keys = require('lodash/keys');
const includes = require('lodash/includes');

const conf = require('./gulp.conf');
const base = require('./webpack-test.conf');

base.module.loaders[1].exclude = /spec\.ts$/;

module.exports = mergeWith({}, base, {
  debug: true,
  module: {
    loaders: [
      {
        test: /\.(png|eot|woff2?|ttf|svg)$/i,
        loader: `url-loader?limit=${ 100 * 1024 }`
      },
      {
        test: /\.s?css$/,
        include: new RegExp(`${conf.paths.src}`),
        loaders: [
          `./${conf.path.conf('loaders', 'to-string-array')}`
        ]
      },
      {
        test: /\.(css|scss)$/,
        include: /node_modules/,
        loaders: [
          'style'
        ]
      },
      {
        test: /\.(css|scss)$/,
        loaders: [
          'css',
          'sass'
        ]
      }
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(handler),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: conf.path.src('index.html')
    }),
    new webpack.ProvidePlugin({
      'jQuery': 'jquery',
      '_': 'lodash'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: isExternal
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'bootstrap'
    }),
    new FaviconsWebpackPlugin({
      logo: `./${conf.path.src('assets', 'favicon.png')}`,
      prefix: 'icons/',
      icons: {
        android: false,
        appleIcon: false,
        appleStartup: false,
        coast: false,
        favicons: true,
        firefox: false,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: false
      }
    })
  ],
  output: {
    path: path.join(process.cwd(), conf.paths.tmp),
    filename: '[name].js'
  },
  entry: {
    app: `./${conf.path.src('index')}`
  }
}, (objValue, srcValue) => {
  if (isArray(objValue)) {
    return objValue.concat(srcValue);
  }
});

module.exports.module.loaders.unshift({
  test: /\.ts/,
  include: new RegExp(`${conf.path.src('app').replace(/(\/|\\)/, '(\/|\\\\)')}`),
  loader: 'baggage?[file].html=template&[file].scss=styles',
});

function handler(percentage, msg) {
  var details = Array.prototype.slice.call(arguments, 2);
  if (percentage < 1) {
    percentage = Math.floor(percentage * 100);
    msg = percentage + "% " + msg;
    if (percentage < 100) {
      msg = " " + msg;
    }
    if (percentage < 10) {
      msg = " " + msg;
    }
    details.forEach(function(detail) {
      if (!detail) return;
      msg += " " + detail
    });
  }
  process.stderr.write(msg + '\n');
}

function isExternal(module) {
  var userRequest = module.userRequest;

  if (typeof userRequest !== 'string') {
    return false;
  }

  return includes(userRequest, 'node_modules');
}
