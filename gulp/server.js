'use strict';

var gulp = require('gulp');

var util = require('util');

var browserSync = require('browser-sync');

var connect = require('gulp-connect');

// var middleware = require('./proxy');

var url = require('url');
var path = require('path');
var proxy = require('proxy-middleware');

function connectInit(baseDir, livereload) {
  connect.server({
    root: baseDir,
    host: '127.0.0.1',
    port: 3001,
    livereload: livereload,
    middleware: function() {
      return [ (function() {
        var options = url.parse('http://127.0.0.1:3000/api');
        options.route = '/api';
        return proxy(options);
      })() ];
    }
  });
}

gulp.task('serve', ['images', 'fonts', 'watch'], function () {
  connectInit([
    './src',
    './.tmp',
    './docs',
    path.resolve('./') // include root (kludge necessary to make bower_components available where index.html expects them)
  ], true);
});

gulp.task('serve:dist', ['build'], function () {
  connectInit(['dist', path.resolve('./')], false);
});

gulp.task('serve:e2e', ['build'], function () {
  connectInit(['src', '.tmp', path.resolve('./')], false);
});

gulp.task('serve:e2e-dist', ['build', 'watch'], function () {
  connectInit(['dist', path.resolve('./')], true);
});
