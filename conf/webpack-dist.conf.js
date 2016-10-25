const webpack = require('webpack');
const conf = require('./gulp.conf');
const path = require('path');
const base = require('./webpack.conf');
const mergeWith = require('lodash/mergeWith');
const isArray = require('lodash/isArray');

const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = mergeWith({}, base, {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {unused: true, dead_code: true, warnings: false} // eslint-disable-line camelcase
    }),
    new ExtractTextPlugin('index-[contenthash].css'),
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
    path: path.join(process.cwd(), conf.paths.dist),
    filename: '[name]-[hash].js'
  }
}, (objValue, srcValue) => {
  if (isArray(objValue)) {
    return objValue.concat(srcValue);
  }
});

module.exports.module.loaders.pop();
module.exports.module.loaders.push({
  test: /\.(css|scss)$/,
  loaders: ExtractTextPlugin.extract({
    fallbackLoader: 'style',
    loader: 'css?minimize!sass!postcss'
  })
});
