const gulp = require('gulp');
const gutil = require('gulp-util');

const webpack = require('webpack');
const gulpConf = require('../conf/gulp.conf');
const browsersync = require('browser-sync');

gulp.task('webpack:dev', done => {
  const webpackConf = require('../conf/webpack.conf');
  webpackWrapper(false, webpackConf, done);
});

gulp.task('webpack:watch', done => {
  const webpackConf = require('../conf/webpack.conf');
  webpackWrapper(true, webpackConf, done);
});

gulp.task('webpack:dist', done => {
  const webpackDistConf = require('../conf/webpack-dist.conf');
  process.env.NODE_ENV = 'production';
  webpackWrapper(false, webpackDistConf, done);
});

gulp.task('webpack:deploy', done => {
  const webpackDeployConf = require('../conf/webpack-deploy.conf');
  process.env.NODE_ENV = 'production';
  webpackWrapper(false, webpackDeployConf, done);
});

function webpackWrapper(watch, conf, done) {
  const webpackBundler = webpack(conf);

  const webpackChangeHandler = (err, stats) => {
    if (err) {
      gulpConf.errorHandler('Webpack')(err);
    }
    gutil.log(stats.toString({
      colors: true,
      chunks: false,
      hash: false,
      version: false
    }));
    if (done) {
      done();
      done = null;
    } else {
      browsersync.reload();
    }
  };

  if (watch) {
    webpackBundler.watch(200, webpackChangeHandler);
  } else {
    webpackBundler.run(webpackChangeHandler);
  }
}
