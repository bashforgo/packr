const path = require('path');

const gulp = require('gulp');
const del = require('del');
const git = require('git-last-commit');
const githubPages = require('gh-pages');

const conf = require('../conf/gulp.conf');

gulp.task('clean:dist', cleanDist);
gulp.task('clean', gulp.parallel('clean:dist'));
gulp.task('other', other);
gulp.task('last-message', getLastMessage);
gulp.task('deploy:gh-pages', ghPages);

function cleanTmp() {
  return del([conf.paths.tmp]);
}

function cleanDist() {
  return del([conf.paths.dist]);
}

function other(done) {
  done();
}

var _commit;

function getLastMessage(done) {
  git.getLastCommit(function(err, commit) {
    if (err) {
      console.log(err);
      done(err);
    }

    _commit = commit;
    done();
  }, { separator: '###' });
}

function ghPages(done) {
  githubPages.publish('dist', {
    message: `[Release ${_commit.shortHash}] ${_commit.subject}`
  }, done);
}
