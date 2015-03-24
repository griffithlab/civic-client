'use strict';

module.exports = function(config) {

  config.set({
    basePath : '..',
    preprocessors: {
      'src/{app,components}/**/*.tpl.html': ['ng-html2js']
    },
    ngHtml2JsPreprocessor: {
      moduleName: 'civicClient'
    },
    files : [
      // bower:js
      "bower_components/angular/angular.js",
      "bower_components/angular-sanitize/angular-sanitize.js",
      "bower_components/angular-ui-router/release/angular-ui-router.js",
      "bower_components/ui-router-extras/release/ct-ui-router-extras.js",
      "bower_components/angular-ui-grid/ui-grid.js",
      "bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
      "bower_components/angular-translate/angular-translate.js",
      "bower_components/angular-dialog-service/dist/dialogs.min.js",
      "bower_components/angular-dialog-service/dist/dialogs-default-translations.min.js",
      "bower_components/lodash/lodash.js",
      "bower_components/angular-resource/angular-resource.js",
      "bower_components/angular-timeago/src/timeAgo.js",
      "bower_components/angular-agility/dist/angular-agility.min.js",
      "bower_components/SHA-1/sha1.js",
      "bower_components/angulartics/src/angulartics.js",
      "bower_components/angulartics/src/angulartics-ga.js",
      "bower_components/angular-mocks/angular-mocks.js",
      // endbower
      'src/{app,components}/**/*.js',
      'src/{app,components}/**/*.tpl.html',
      'test/unit/**/*.spec.js'
    ],
    autoWatch : false,
    frameworks: ['mocha', 'chai', 'sinon'],
    browsers : ['PhantomJS'],
    reporters: ['spec'],
    plugins : [
      'karma-phantomjs-launcher',
      'karma-mocha',
      'karma-chai',
      'karma-sinon',
      'karma-spec-reporter',
      'karma-ng-html2js-preprocessor'
    ]
  });

};
