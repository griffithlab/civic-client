'use strict';

var gulp = require('gulp');
var angularProtractor = require('gulp-angular-protractor');

gulp.task('test:protractor', function(done) {
  gulp.src(['test/e2e/**/*.spec.js'])
    .pipe(angularProtractor({
      'configFile': 'test/protractor.conf.js',
      //'args': ['--baseUrl', 'http://127.0.0.1:3001'],
      'autoStartStopServer': true,
      'debug': true
    }))
    .on('error', function(e) { throw e })
    .on('end', function() {
      done();
    });
});

//
//var browserSync = require('browser-sync');
//
//// Downloads the selenium webdriver
//gulp.task('webdriver-update', $.protractor.webdriver_update);
//
//gulp.task('webdriver-standalone', $.protractor.webdriver_standalone);
//
//gulp.task('protractor-only', ['webdriver-update', 'wiredep'], function (done) {
//  var testFiles = [
//    'test/e2e/**/*.spec.js'
//  ];
//
//  gulp.src(testFiles)
//    .pipe($.protractor.protractor({
//      configFile: 'test/protractor.conf.js'
//    }))
//    .on('error', function (err) {
//      // Make sure failed tests cause gulp to exit non-zero
//      throw err;
//    })
//    .on('end', function () {
//      // Close browser sync server
//      browserSync.exit();
//      done();
//    });
//});
//
//gulp.task('protractor', ['serve:e2e', 'protractor-only']);
//gulp.task('protractor:src', ['serve:e2e', 'protractor-only']);
//gulp.task('protractor:dist', ['serve:e2e-dist', 'protractor-only']);
