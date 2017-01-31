'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect');

gulp.task('watch', ['inject'] ,function () {
  gulp.watch('src/{app,components}/**/*.less', ['inject'])
    .on('change', function(file) {gulp.src(file.path).pipe(connect.reload());});

  gulp.watch('src/assets/images/**/*', ['images'])
    .on('change', function(file) {gulp.src(file.path).pipe(connect.reload());});

  //Because the only way to propagate the changes to .tmp/index.html is through inject
  gulp.watch(['src/{app,components}/**/*.js', 'src/index.html', 'bower.json'], ['inject'])
    .on('change', function(file) {gulp.src(file.path).pipe(connect.reload());});

});
