'use strict';

var gulp = require('gulp');

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  return gulp.src('src/index.html')
    .pipe(wiredep({
      directory: 'bower_components',
      exclude: [
        /bootstrap-sass-official/,
        /angulartics-google-analytics/, // see note in index.html and components/angulartics-ga.js
        /\/bootstrap.js/,
        /bootstrap.css/,
        /please-wait/,
        /jquery.js/,
        /waypoints.js/,
        /SHA-1.js/
      ]
    }))
    .pipe(gulp.dest('src'));
});
