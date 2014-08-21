var gulp = require('gulp');
var git = require('gulp-git');
var bump = require('gulp-bump');
var version = require('./package.json').version;

// semantic versioning

var _bump = function(type) {
  gulp.src('./package.json')
  .pipe(bump({ type: type }))
  .pipe(gulp.dest('./'));

  version = version.split('.');

  switch(type) {
    case 'patch':
      version[2] = (parseInt(version[2]) + 1).toString();
      break;
    case 'minor':
      version[1] = (parseInt(version[1]) + 1).toString();
      break;
    case 'major':
      version[0] = (parseInt(version[0]) + 1).toString();
      break;
  }

  version = version.join('.');
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
  git.tag('v' + version, 'Tag v' + version, function(err) {
    if (err) throw err;
  });
});

gulp.task('commit', function() {
  gulp.src('./package.json')
  .pipe(git.commit('Tag v' + version));
});

gulp.task('push', function() {
  git.push('origin', 'master', function(err) {
    if (err) throw err;
  });
});

// release

gulp.task('release', ['commit', 'tag', 'push']);
gulp.task('release-patch', ['patch', 'release']);
gulp.task('release-minor', ['minor', 'release']);
gulp.task('release-major', ['major', 'release']);

// default

gulp.task('default', ['release-patch']);
