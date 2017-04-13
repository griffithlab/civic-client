'use strict';

var gulp = require('gulp');

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  return gulp.src('src/{index,404}.html')
    .pipe(wiredep({
      directory: 'bower_components',
      exclude: [
        /bootstrap-sass-official/,
        /\/bootstrap.js/,
        /bootstrap.css/,
        /please-wait/,
        /jquery.js/,
        /waypoints.js/,
        /SHA-1.js/
      ]
    }))
    .pipe(gulp.dest('.tmp'));
});
