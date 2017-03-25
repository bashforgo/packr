const path = require('path');
const Manager = require('webpack-manager');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const conf = require('./gulp.conf');

const slashes = /[\/\\]/;

const DEBUG_BUNDLE = false;

module.exports = function(env) {
  const manager = new Manager();

  const test = env === 'test';
  const dev = env === 'dev';
  const dist = env === 'dist';
  const deploy = env === 'deploy';
  const devUp = dev || dist || deploy;
  const distUp = dist || deploy;

  const jsts = /\.[jt]s$/;
  const ts = /\.ts$/;
  const specs = /\.spec\./;
  const json = /\.json$/;
  const html = /\.html$/;
  const styles = /\.s?css$/;
  const nearley = /\.ne$/;

  const nodeModules = /node_modules/;
  const src = new RegExp(`${conf.paths.src}`);
  const slashesS = '[\\/\\\\]';

  if (devUp) {
    manager.entry({
      app: `./${conf.path.src('index')}`
    });
  }

  manager.devtool(distUp ? 'hidden-source-map' : 'source-map');

  const rules = manager.module.rules;

  if (distUp) {
    rules.add({
      enforce: 'pre',
      test: ts,
      exclude: test ? nodeModules : specs,
      loaders: [{
        loader: 'tslint-loader',
        options: { configFile: 'tslint.json' }
      }]
    });
  }

  if (devUp) {
    rules.add({
      test: ts,
      include: new RegExp(`${conf.path.src('app').replace(slashes, slashesS)}`),
      use: 'baggage-loader?[file].html=template&[file].scss=styles',
    });
  }

  rules.add([{
    test: json,
    loaders: [
      'json-loader'
    ]
  }, {
    test: ts,
    exclude: test ? nodeModules : specs,
    loaders: ['ts-loader']
  }, {
    test: html,
    loaders: ['html-loader']
  }, {
    test: nearley,
    loaders: ['nearley-loader']
  }]);

  if (devUp) {
    rules.add([{
      test: /\.(png|eot|woff2?|ttf|svg)$/i,
      use: `url-loader?limit=${ 100 * 1024 }&name=assets/[name].[hash:5].[ext]`
    }, {
      test: styles,
      include: src,
      loaders: [`./${conf.path.conf('loaders', 'to-string-array')}`]
    }])
  }

  if (dev) {
    rules.add([{
      test: styles,
      include: nodeModules,
      loaders: ['style-loader']
    }, {
      test: styles,
      loaders: ['css-loader', 'sass-loader']
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
      use: `css-loader?${JSON.stringify(scssQuery)}!sass-loader`
    };

    rules.add([{
      test: styles,
      include: nodeModules,
      loaders: ExtractTextPlugin.extract(scssLoader)
    }, {
      test: styles,
      include: new RegExp(`${conf.paths.src}`),
      use: scssLoader.use
    }])
  }

  const plugins = manager.plugins;

  if (DEBUG_BUNDLE) {
    manager.profile(true);

    const StatsPlugin = require('stats-webpack-plugin');

    plugins.add([
      new StatsPlugin('stats.json', 'verbose')
    ]);
  }

  plugins.add([
    new webpack.ContextReplacementPlugin(
      new RegExp(`angular${slashesS}core${slashesS}@angular`),
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
      new webpack.NoEmitOnErrorsPlugin(),
      new HtmlWebpackPlugin({
        template: conf.path.src('index.html')
      }),
      new webpack.ProvidePlugin({
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
        prefix: 'assets/icons-[hash:5]/',
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
      new ExtractTextPlugin('css/[name].[contenthash:5].css')
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
      filename: 'js/[name].[chunkhash:5].js',
      path: path.join(process.cwd(), conf.paths.dist),
      sourceMapFilename: 'maps/[file].map'
    })
  }

  manager.resolve.extensions([
    '.webpack.js',
    '.web.js',
    '.js',
    '.ts'
  ]);

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
const last = require('lodash/last');

const colors = require('colors');

function handler(percentage, msg) {
  const details = Array.prototype.slice.call(arguments, 2);
  const msgDetails = normalize(details);
  const msgPercentage = padStart(Math.floor(percentage * 100) + '', 3) + '%';

  console.log(compact([msgPercentage.red, msg.magenta, msgDetails]).join(' - '.grey))
}

function normalize(details) {
  'use strict';
  const separator = ' | '.grey;

  if (!details.length) {
    return null;
  } else if (details.length === 3) {
    let [modules, active, path] = details;

    if (path) {
      const loaderParts = path.split('!');

      if (loaderParts.length) {
        const [file, ...loaders] = loaderParts.reverse();

        if (file) {
          const fileParts = file.split(slashes).slice(-2);

          if (includes(fileParts[1], 'index')) {
            fileParts.pop();
            fileParts [0] = fileParts[0].yellow
          }

          const nodeModule = findNodeModule(file);
          if (nodeModule && fileParts[0].reset !== nodeModule) {
            fileParts.unshift(nodeModule, '*'.grey)
          }

          var fileOut = fileParts.join('/'.grey);
        }

        var loaderOut = map(loaders, function(loader) {
          return findNodeModule(loader) || last(loader.split(slashes));
        }).reverse().join('!'.grey);

        var pathOut = compact([loaderOut, fileOut]).join('!'.red);
      }
    }

    return compact([padStart(modules, 15).yellow, padStart(active, 10).cyan, pathOut]).join(separator);
  } else {
    return details.join(separator);
  }
}

function findNodeModule(path) {
  const pathParts = path.split(/[\/\\]/);
  const moduleIndex = indexOf(pathParts, 'node_modules');
  return moduleIndex >= 0 ? pathParts[moduleIndex + 1] : null;
}

function isExternal(module) {
  var userRequest = module.userRequest;

  if (typeof userRequest !== 'string') {
    return false;
  }

  return includes(userRequest, 'node_modules');
}
