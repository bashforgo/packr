const webpack = require('webpack');

const mergeWith = require('lodash/mergeWith');
const isArray = require('lodash/isArray');

const base = require('./webpack-dist.conf');

base.plugins.shift();

module.exports = mergeWith({}, base, {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.BASE_HREF': '"/packr/"'
    })
  ],
}, (objValue, srcValue) => {
  if (isArray(objValue)) {
    return objValue.concat(srcValue);
  }
});
