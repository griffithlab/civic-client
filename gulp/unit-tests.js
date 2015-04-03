'use strict';

var gulp = require('gulp');
var wiredep = require('wiredep').stream;
var path = require('path');
var karma = require('karma').server;

//Run test once and exit
gulp.task('test:unit', ['test:unit:wiredep'], function (done) {
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

// Run all unit tests in debug mode
gulp.task('test:unit:debug', function () {
  // helper function for debugging node child_process
  (function() {
    var childProcess = require("child_process");
    var oldSpawn = childProcess.spawn;
    function mySpawn() {
      console.log('spawn called');
      console.log(arguments);
      var result = oldSpawn.apply(this, arguments);
      return result;
    }
    childProcess.spawn = mySpawn;
  })();

  var spawn = require('child_process').spawn;
  spawn('node-debug', [
    '--debug-brk',
    path.join(__dirname, '../node_modules/gulp/bin/gulp.js'),
    'test:unit'
  ], { stdio: 'inherit'});
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

