'use strict';

var gulp = require('gulp');
var angularProtractor = require('gulp-angular-protractor');

gulp.task('test:e2e', ['serve'], function() {
  gulp.src(['test/e2e/**/*.spec.js'])
    .pipe(angularProtractor({
      'configFile': 'test/protractor.conf.js',
      //'args': ['--baseUrl', 'http://127.0.0.1:3001'],
      'autoStartStopServer': true,
      'debug': true
    }))
    .once('error', function(e) { throw e })
    .once('end', function() { process.exit(); });
});

gulp.task('test:e2e:dist', ['serve:e2e-dist-static'], function() {
  gulp.src(['test/e2e/**/*.spec.js'])
    .pipe(angularProtractor({
      'configFile': 'test/protractor.conf.js',
      //'args': ['--baseUrl', 'http://127.0.0.1:3001'],
      'autoStartStopServer': true,
      'debug': true
    }))
    .once('error', function(e) { throw e })
    .once('end', function() { process.exit(); });
});

var protractor = require('protractor');

// Downloads the selenium webdriver
gulp.task('webdriver-update', protractor.webdriver_update);
gulp.task('webdriver-standalone', protractor.webdriver_standalone);
