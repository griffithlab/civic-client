'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect');

gulp.task('watch', ['styles', 'liveinject'] ,function () {
  gulp.watch('src/{app,components}/**/*.less', ['styles'])
    .on('change', function(file) {gulp.src(file.path).pipe(connect.reload());});

  gulp.watch('src/{app,components}/**/*.js', ['scripts'])
    .on('change', function(file) {gulp.src(file.path).pipe(connect.reload());});

  gulp.watch('src/assets/images/**/*', ['images'])
    .on('change', function(file) {gulp.src(file.path).pipe(connect.reload());});

  gulp.watch(['src/index.html', 'bower.json'], ['liveinject'])
    .on('change', function(file) {gulp.src(file.path).pipe(connect.reload());});

  gulp.watch('src/{app,components}/**/*.html', ['liveinject'])
    .on('change', function(file) {gulp.src(file.path).pipe(connect.reload());});

});

gulp.task('liveinject', ['wiredep', 'partials'], function(){
  var inject = require('gulp-inject');
  return gulp.src('.tmp/*.html')
    .pipe(inject(
      // stream JS files in app/component directories
      gulp.src('.tmp/{app,components}/**/*.js'),
      {
        starttag: '<!-- inject:partials -->',
        addRootSlash: false,
        addPrefix: '../'
      }))
    .pipe(gulp.dest('.tmp'))
})
