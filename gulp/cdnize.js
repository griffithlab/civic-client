'use strict';

var gulp = require('gulp');
var cdnizer = require('gulp-cdnizer');

gulp.task('cdnize', ['wiredep'], function () {
  return gulp.src('src/*.html')
  .pipe(cdnizer({
    //configure cdnizer's version and naming settings
    allowRev: false, //stricter version matching
    allowMin: true, //request minified files
    relativeRoot: 'src/', //asset root directory
    //regex for allowing vendor stylesheets to be cdnized as well
    matchers: [
      /(<link rel="stylesheet" href=")(.+?)(" \/>)/gi
    ],
    files: [
      //list of host:package pairs for simple packages
      'cdnjs:angular-scroll',
      'cdnjs:angular-ui-router',
      'cdnjs:angular-formly',
      'cdnjs:angular-bootstrap',
      'cdnjs:angular-timeago',
      'cdnjs:angular-elastic',
      'cdnjs:angulartics',
      'cdnjs:angular-formly-templates-bootstrap',
      'cdnjs:font-awesome',
      'cdnjs:api-check@7.5.3',
      //manual file->cdn settings for packages which could not be
      //automatically resolved by cdnizer using the above method
      {
        file: '**/angular/angular.js',
        cdn: 'google:angular:${ filenameMin }'
      },
      {
        file: '**/angular-sanitize/*.js',
        package: 'angular-sanitize',
        cdn: 'google:angular:${ filenameMin }'
      },
      {
        file: '**/angular-touch/*.js',
        package: 'angular-touch',
        cdn: 'google:angular:${ filenameMin }'
      },
      {
        file: '**/angular-messages/*.js',
        package: 'angular-messages',
        cdn: 'google:angular:${ filenameMin }'
      },
      {
        file: '**/angular-bootstrap/*.js',
        package: 'angular-bootstrap',
        cdn: 'cdnjs:angular-ui-bootstrap:${ filenameMin }'
      },
      {
        file: '**/lodash/*.js',
        package: 'lodash',
        cdn: 'cdnjs:lodash.js:${ filenameMin }'
      },
      {
        file: '**/angular-dialog-service/**/*.{js,css}',
        package: 'angular-dialog-service',
        cdn: 'cdnjs:angular-dialog-service:${ filenameMin }'
      },
      {
        file: '**/ui-router-extras/**/*.js',
        package: 'ui-router-extras',
        cdn: '//cdnjs.cloudflare.com/ajax/libs/ui-router-extras/${ version }/${ filenameMin }'
      },
      {
        file: '**/angulartics-google-analytics/**/*.js',
        cdn: '//cdnjs.cloudflare.com/ajax/libs/angulartics-google-analytics/0.1.1/${ filenameMin }'
      },
      {
        file: '**/ngDialog/**/*.js',
        package: 'ngDialog',
        cdn: 'cdnjs:ng-dialog:js/${ filenameMin }'
      },
      {
        file:'**/ngDialog/**/*.css',
        package: 'ngDialog',
        cdn: 'cdnjs:ng-dialog:css/${ filenameMin }'
      },
      {
        file: '**/ment.io/**/*.js',
        package: 'ment.io',
        cdn: '//cdn.jsdelivr.net/angular.ment-io/${ version }/${ filenameMin }'
      },
      {
        file: '**/pdfmake/**/*.js',
        package: 'pdfmake',
        cdn: '//cdnjs.cloudflare.com/ajax/libs/pdfmake/${ version }/${ filename }'
      },
      {
        file: '**/angular-resource/*.js',
        package: 'angular-resource',
        cdn: 'google:angular:${ filenameMin }'
      },
      {
        file: '**/angular-translate/*.js',
        package: 'angular-translate',
        cdn: '//cdn.jsdelivr.net/angular.translate/${ version }/${ filenameMin }'
      },
      {
        file: '**/waypoints/**/*.js',
        package: 'waypoints',
        cdn: 'cdnjs:waypoints:${ filename }'
      },
      {
        file: '**/angular-ui-grid/**/*.{js,css}',
        package: 'angular-ui-grid',
        cdn: 'cdnjs:angular-ui-grid:${ filenameMin }'
      },
      {
        file: '**/angular-loading-bar/**/*.{js,css}',
        package: 'angular-loading-bar',
        cdn: 'cdnjs:angular-loading-bar:${ filenameMin }'
      },
    ]
  }))


    .pipe(gulp.dest('.tmp'))
});
