const path = require('path');
const Manager = require('webpack-manager');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const conf = require('./gulp.conf');

module.exports = function(env) {
  const manager = new Manager();

  const test = env === 'test';
  const dev = env === 'dev';
  const dist = env === 'dist';
  const deploy = env === 'deploy';
  const devUp = dev || dist || deploy;
  const distUp = dist || deploy;

  const ts = /\.ts$/;
  const json = /\.json$/;
  const html = /\.html$/;
  const styles = /\.s?css$/;

  const nodeModules = /node_modules/;
  const src = new RegExp(`${conf.paths.src}`);
  const slashesR = /(\/|\\)/;
  const slashes = '(\\/|\\\\)';

  if (devUp) {
    manager.entry({
      app: `./${conf.path.src('index')}`
    });
  }

  manager.debug(true);
  manager.devtool('source-map');

  manager.module.preLoaders.add({
    test: ts,
    exclude: nodeModules,
    loader: 'tslint'
  });

  const loaders = manager.module.loaders;

  if (devUp) {
    loaders.add([{
      test: ts,
      include: new RegExp(`${conf.path.src('app').replace(slashesR, slashes)}`),
      loader: 'baggage?[file].html=template&[file].scss=styles',
    }])
  }

  loaders.add([{
    test: json,
    loaders: [
      'json'
    ]
  }, {
    test: ts,
    exclude: test ? nodeModules : /spec\.ts$/,
    loaders: ['ts']
  }, {
    test: html,
    loaders: ['html']
  }]);

  if (devUp) {
    loaders.add([{
      test: /\.(png|eot|woff2?|ttf|svg)$/i,
      loader: `url-loader?limit=${ 100 * 1024 }`
    }, {
      test: styles,
      include: src,
      loaders: [`./${conf.path.conf('loaders', 'to-string-array')}`]
    }])
  }

  if (dev) {
    loaders.add([{
      test: styles,
      include: nodeModules,
      loaders: ['style']
    }, {
      test: styles,
      loaders: ['css', 'sass']
    }])
  }

  if (distUp) {
    const scssQuery = {
      minimize: true,
      autoprefixer: { add: true, browsers: ['> 1% in my stats'], stats: require('./stats') },
      discardComments: {
        removeAll: true
      }
    };

    const scssLoader = {
      loader: `css?${JSON.stringify(scssQuery)}!sass`
    };

    loaders.add([{
      test: styles,
      include: nodeModules,
      loaders: ExtractTextPlugin.extract(scssLoader)
    }, {
      test: styles,
      include: new RegExp(`${conf.paths.src}`),
      loaders: [scssLoader]
    }])
  }

  const plugins = manager.plugins;

  plugins.add([
    new webpack.ContextReplacementPlugin(
      new RegExp(`angular${slashes}core${slashes}(esm${slashes}src|src)${slashes}linker`),
      conf.paths.src
    ),
    new webpack.DefinePlugin({
      'process.env.BASE_HREF': deploy ? '"/packr/"' : '"/"'
    })
  ]);

  if (devUp) {
    plugins.add([
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
        icons: dist || deploy ? {
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
        } : {
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
    ])
  }

  if (distUp) {
    plugins.add([
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: { unused: true, dead_code: true, warnings: false }, // eslint-disable-line camelcase
        comments: false,
        sourceMap: true
      }),
      new ExtractTextPlugin('[name].[contenthash].css')
    ])
  }

  if (dev) {
    manager.output({
      path: path.join(process.cwd(), conf.paths.tmp),
      filename: '[name].js'
    });
  }

  if (distUp) {
    manager.output({
      filename: '[name].[chunkhash].js',
      path: path.join(process.cwd(), conf.paths.dist),
      sourceMapFilename: 'maps/[file].map'
    })
  }

  manager.resolve.extensions([
    '',
    '.webpack.js',
    '.web.js',
    '.js',
    '.ts'
  ]);

  manager.set('ts', { configFileName: 'tsconfig.json' });
  manager.set('tslint', { configuration: require('../tslint.json') });

  return manager.setup();
};

const includes = require('lodash/includes');
const padStart = require('lodash/padStart');
const map = require('lodash/map');
const invokeMap = require('lodash/invokeMap');
const compact = require('lodash/compact');
const flow = require('lodash/flow');
const head = require('lodash/head');
const indexOf = require('lodash/indexOf');

function handler(percentage, msg) {
  const details = Array.prototype.slice.call(arguments, 2);
  const msgDetails = normalize(details);
  const msgPercentage = padStart(Math.floor(percentage * 100) + '', 3) + '%';

  console.log([msgPercentage, msg, msgDetails].join(' '))
}

function normalize(details) {
  'use strict';

  return map(details.join('!!').split('!'), function(lines) {
    let meaningfulPath = lines.split(/[\/\\]/);
    if (includes(meaningfulPath, 'node_modules')) {
      let nodeModule = meaningfulPath[indexOf(meaningfulPath, 'node_modules') + 1];
      meaningfulPath = meaningfulPath.slice(-2);
      if (meaningfulPath[0] !== nodeModule) {
        meaningfulPath.unshift(nodeModule, '*');
      }
    } else {
      meaningfulPath = meaningfulPath.slice(-2);
    }
    return compact(invokeMap(meaningfulPath, flow(
      String.prototype.split,
      head,
      (i) => includes(['index.js', 'loader.js'], i) ? null : i
    ), '?')).join('/')
  }).join('!').replace(/!!/g, ' ')
}

function isExternal(module) {
  var userRequest = module.userRequest;

  if (typeof userRequest !== 'string') {
    return false;
  }

  return includes(userRequest, 'node_modules');
}
