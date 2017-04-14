'use strict';

var gulp = require('gulp');
var cdnizer = require('gulp-cdnizer');

gulp.task('cdnize', ['inject'], function () {
  return gulp.src('.tmp/*.html')
  .pipe(cdnizer({
    //configure cdnizer's version and naming settings
    allowRev: false, //stricter version matching
    allowMin: true, //request minified files
    relativeRoot: 'src/', //asset root directory
    fallbackTest: '<script>if(!(${ test })) cdnizerLoad("${ filepathRel }");</script>',
    files: [
      //manual cdn configuations for all dependencies,
      //including tests for missing individual angular modules
      {
        file: '**/angular/angular.js',
        package: 'angular',
        // cdn: 'cdnjs:angular:${ filenameMin }'
        cdn: '//cdnjs.cloudflare.com/ajax/libs/angular.js/${ version }/${ filenameMin }',
      },
      {
        file: '**/angular-sanitize/*.js',
        package: 'angular-sanitize',
        cdn: '//cdnjs.cloudflare.com/ajax/libs/angular.js/${ version }/${ filenameMin }',
        test: 'testModule("ngSanitize")'
      },
      {
        file: '**/angular-touch/*.js',
        package: 'angular-touch',
        cdn: '//cdnjs.cloudflare.com/ajax/libs/angular.js/${ version }/${ filenameMin }',
        test: 'testModule("ngTouch")'
      },
      {
        file: '**/angular-messages/*.js',
        package: 'angular-messages',
        cdn: '//cdnjs.cloudflare.com/ajax/libs/angular.js/${ version }/${ filenameMin }',
        test: 'testModule("ngMessages")'
      },
      {
        file: '**/angular-bootstrap/*.js',
        package: 'angular-bootstrap',
        cdn: 'cdnjs:angular-ui-bootstrap:${ filenameMin }',
        test: 'testModule("ui.bootstrap")'
      },
      {
        file: '**/lodash/*.js',
        package: 'lodash',
        cdn: 'cdnjs:lodash.js:${ filenameMin }',
        test: 'window._'
      },
      {
        file: '**/angular-dialog-service/**/*.js',
        package: 'angular-dialog-service',
        cdn: 'cdnjs:angular-dialog-service:${ filenameMin }',
        test: 'testModule("dialogs.main")'
      },
      {
        file: '**/angular-dialog-service/**/*.css',
        package: 'angular-dialog-service',
        cdn: 'cdnjs:angular-dialog-service:${ filenameMin }',
      },
      {
        file: '**/ui-router-extras/**/*.js',
        package: 'ui-router-extras',
        cdn: '//cdnjs.cloudflare.com/ajax/libs/ui-router-extras/${ version }/${ filenameMin }',
        test: 'testModule("ct.ui.router.extras")'
      },
      // {
      //   file: '**/angulartics-google-analytics/**/*.js',
      //   cdn: '//cdnjs.cloudflare.com/ajax/libs/angulartics-google-analytics/0.1.1/${ filenameMin }',
      //   test: 'testModule("angulartics.google.analytics")'
      // },
      {
        file: '**/ngDialog/**/*.js',
        package: 'ngDialog',
        cdn: 'cdnjs:ng-dialog:js/${ filenameMin }',
        test: 'testModule("ngDialog")'
      },
      {
        file:'**/ngDialog/**/*.css',
        package: 'ngDialog',
        cdn: 'cdnjs:ng-dialog:css/${ filenameMin }'
      },
      {
        file: '**/ment.io/**/*.js',
        package: 'ment.io',
        cdn: '//cdn.jsdelivr.net/angular.ment-io/${ version }/${ filenameMin }',
        test: 'testModule("mentio")'
      },
      {
        file: '**/angular-resource/*.js',
        package: 'angular-resource',
        cdn: '//cdnjs.cloudflare.com/ajax/libs/angular.js/${ version }/${ filenameMin }',
        test: 'testModule("ngResource")'
      },
      {
        file: '**/angular-translate/*.js',
        package: 'angular-translate',
        cdn: '//cdn.jsdelivr.net/angular.translate/${ version }/${ filenameMin }',
        test: 'testModule("pascalprecht.translate")'
      },
      {
        file: '**/waypoints/**/*.js',
        package: 'waypoints',
        cdn: 'cdnjs:waypoints:${ filename }',
        test: 'Waypoint'
      },
      {
        file: '**/angular-ui-grid/**/*.js',
        package: 'angular-ui-grid',
        cdn: 'cdnjs:angular-ui-grid:${ filenameMin }',
        test: 'testModule("ui.grid")'
      },
      {
        file: '**/angular-loading-bar/**/*.js',
        package: 'angular-loading-bar',
        cdn: 'cdnjs:angular-loading-bar:${ filenameMin }',
        test: 'testModule("angular-loading-bar")'
      },
      {
        file: '**/angular-loading-bar/**/*.css',
        package: 'angular-loading-bar',
        cdn: 'cdnjs:angular-loading-bar:${ filenameMin }',
      },
      {
        file: '**/angular-ui-router/**/*.js',
        package: 'angular-ui-router',
        cdn: 'cdnjs:angular-ui-router:${ filenameMin }',
        test: 'testModule("ui.router")'
      },
      {
        file: '**/api-check/**/*.js',
        package: 'api-check',
        cdn: 'cdnjs:api-check:${ filenameMin }',
        test: 'window.apiCheck'
      },
      {
        file: '**/angular-formly/**/*.js',
        package: 'angular-formly',
        cdn: 'cdnjs:angular-formly:${ filenameMin }',
        test: 'testModule("formly")'
      },
      {
        file: '**/angulartics/**/*.js',
        package: 'angulartics',
        cdn: 'cdnjs:angulartics:${ filenameMin }',
        test: 'testModule("angulartics")'
      },
      {
        file: '**/angular-scroll/*.js',
        package: 'angular-scroll',
        cdn: 'cdnjs:angular-scroll:${ filenameMin }',
        test: 'testModule("duScroll")'
      },
      {
        file: '**/angular-elastic/*.js',
        package: 'angular-elastic',
        cdn: 'cdnjs:angular-elastic:${ filenameMin }',
        test: 'testModule("monospaced.elastic")'
      },
      {
        file: '**/angular-formly-templates-bootstrap/**/*.js',
        package: 'angular-formly-templates-bootstrap',
        cdn: 'cdnjs:angular-formly-templates-bootstrap:${ filenameMin }',
        test: 'testModule("formlyBootstrap")'
      },
      {
        file: '**/d3/*.js',
        package: 'd3',
        cdn: 'cdnjs:d3:${ filenameMin }',
        test: 'window.d3'
      },
      {
        file : '**/dimple/**/*.js',
        package: 'dimple',
        cdn: '//cdnjs.cloudflare.com/ajax/libs/dimple/${ version }/dimple.latest.min.js',
        test: 'window.dimple'
      }
    ]
  }))


    .pipe(gulp.dest('.tmp'))
});
