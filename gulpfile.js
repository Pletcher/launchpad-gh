var gulp = require('gulp');
var git = require('gulp-git');
var bump = require('gulp-bump');

// semantic versioning

var _bump = function(type) {
  gulp.src('./package.json')
  .pipe(bump({ type: type }))
  .pipe(gulp.dest('./'));
};

gulp.task('patch', function() {
  _bump('patch');
});

gulp.task('minor', function() {
  _bump('minor');
});

gulp.task('major', function() {
  _bump('major');
});

// git

gulp.task('tag', function() {
  var version = require('./package.json').version;

  git.tag('v' + version, 'Tag v' + version, function(err) {
    if (err) throw err;
  });
});

gulp.task('commit', function() {
  var version = require('./package.json').version;

  gulp.src('./*')
  .pipe(git.commit('Tag v' + version));
});

gulp.task('push', function() {
  git.push('origin', 'master', function(err) {
    if (err) throw err;
  });
});

// release

gulp.task('release', ['tag', 'commit', 'push']);
gulp.task('release-patch', ['patch', 'release']);
gulp.task('release-minor', ['minor', 'release']);
gulp.task('release-major', ['major', 'release']);

// default

gulp.task('default', ['release-patch']);
