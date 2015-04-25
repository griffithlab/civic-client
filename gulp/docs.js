'use strict';

var gulp = require('gulp');
var gulpDocs = require('gulp-ngdocs');

gulp.task('docs:generate', [], function () {
  var options = {
    scripts: [
      'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.28/angular.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.28/angular-animate.min.js'
    ],
    html5Mode: false,
    startPage: '/docs',
    title: "CIViC Client Developer Documentation",
    image: "CIViC_logo_sm.png",
    imageLink: "http://civicdb.org",
    titleLink: "/docs",
    discussions: true
  };

  return gulp.src('src/{app,components}/**/*.js')
    .pipe(gulpDocs.process(options))
    .pipe(gulp.dest('./docs'));
});
