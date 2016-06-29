'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect');

gulp.task('watch', ['styles', 'partials'] ,function () {
  gulp.watch('src/{app,components}/**/*.less', ['styles'])
    .on('change', function(file) {gulp.src(file.path).pipe(connect.reload());});

  gulp.watch('src/{app,components}/**/*.js', ['scripts'])
    .on('change', function(file) {gulp.src(file.path).pipe(connect.reload());});

  gulp.watch('src/assets/images/**/*', ['images'])
    .on('change', function(file) {gulp.src(file.path).pipe(connect.reload());});

  gulp.watch(['src/index.html', 'bower.json'], ['wiredep'])
    .on('change', function(file) {gulp.src(file.path).pipe(connect.reload());});

  gulp.watch('src/{app,components}/**/*.html', ['partials'])
    .on('change', function(file) {gulp.src(file.path).pipe(connect.reload());});

});
