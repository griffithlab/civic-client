'use strict';

module.exports = function(config) {
  config.set({
    basePath : '..',
    files : [
      // bower
      "bower_components/angular/angular.js",
      "bower_components/angular-sanitize/angular-sanitize.js",
      "bower_components/angular-ui-router/release/angular-ui-router.js",
      "bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
      "bower_components/angular-ui-router-tabs/src/ui-router-tabs.js",
      "bower_components/ui-router-extras/release/ct-ui-router-extras.js",
      "bower_components/angular-ui-grid/ui-grid.js",
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
      "bower_components/ngDialog/js/ngDialog.js",
      "bower_components/angular-loading-bar/build/loading-bar.js",
      "bower_components/angular-mocks/angular-mocks.js",
      "bower_components/angular-q-constructor/release/angular-q-constructor.js",
      // endbower

      // app files, specs, and test fixtures
      'src/{app,components}/**/*.js',
      'src/{app,components}/**/*.tpl.html',
      'test/karma.setup.js',
      'test/fixtures/json/**/*.json',
      'src/{app,components}/**/*.spec.js'
    ],

    plugins : [
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-spec-reporter',
      'karma-jquery-chai',
      'karma-ng-html2js-preprocessor',
      'karma-ng-json2js-preprocessor',
      'karma-browserify'
    ],

    // setup preprocessors
    preprocessors: {
      'src/{app,components}/**/*.tpl.html': ['ng-html2js'],
      'test/fixtures/json/**/*.json': ['ng-json2js'],
      'test/karma.setup.js': ['browserify']
    },
    ngHtml2JsPreprocessor: {
      moduleName: 'civic.templates',
      stripPrefix: 'src/'
    },
    ngJson2JsPreprocessor: {
      stripPrefix: 'test/fixtures/json/',
      prependPrefix: 'served/'
    },

    // setup frameworks
    frameworks: ['mocha', 'browserify', 'jquery-chai'],
    browserify: {
      debug: true,
      files: [
        'test/karma.setup.js'
      ]
    },

    browsers : [
      'PhantomJS'
      //,'Chrome'
      //,'Firefox'
    ],
    reporters: ['mocha'],
    autoWatch : false,
    logLevel: config.LOG_INFO
  });
};
