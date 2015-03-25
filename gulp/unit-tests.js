'use strict';

var gulp = require('gulp');
var wiredep = require('wiredep').stream;
var karma = require('karma').server;

//Run test once and exit
gulp.task('test:unit', ['test:unit:wiredep'], function (done) {
  debugger;
  karma.start({
    configFile: __dirname + '/../test/karma.conf.js',
    logLevel: 'info',
    singleRun: true
  }, done);
});

// Watch for file changes and re-run tests on each change
gulp.task('test:unit:watch', ['test:unit:wiredep'], function (done) {
  karma.start({
    configFile: __dirname + '/../test/karma.conf.js'
  }, done);
});

// inject bower components into karma.conf
gulp.task('test:unit:wiredep', function () {
  return gulp.src('test/karma.conf.js')
    .pipe(wiredep({
      directory: 'bower_components',
      exclude: [
        /bootstrap-sass-official/,
        /\/bootstrap.js/,
        /bootstrap.css/,
        /jquery.js/,
        /waypoints.js/,
        /SHA-1.js/
      ],
      devDependencies: true,
      ignorePath: '../',
      fileTypes: {
        js: {
          block: /(([ \t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
          detect: {
            js: /".*\.js"/gi
          },
          replace: {
            js: '"{{filePath}}",'
          }
        }
      }
    }))
    .pipe(gulp.dest('test'));
});
