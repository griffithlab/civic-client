'use strict';

module.exports = function(config) {

  config.set({
    basePath : '..',
    preprocessors: {
      'src/{app,components}/**/*.tpl.html': ['ng-html2js'],
      'test/karma.setup.js': ['browserify']
    },
    ngHtml2JsPreprocessor: {
      moduleName: 'civic.templates',
      stripPrefix: 'src/'
    },
    logLevel: config.LOG_DEBUG,
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
      'test/karma.setup.js',
      'src/{app,components}/**/*.spec.js'
    ],
    autoWatch : false,
    frameworks: ['mocha', 'browserify'],
    //client: {
    //  mocha: {
    //    reporter: 'html', // change Karma's debug.html to the mocha web reporter
    //    ui: 'tdd'
    //  }
    //},
    browsers : ['PhantomJS'],
    //browsers : ['Chrome'],
    reporters: ['spec'],
    plugins : [
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-mocha',
      'karma-spec-reporter',
      'karma-ng-html2js-preprocessor',
      'karma-browserify'
    ],
    browserify: {
      debug: true,
      files: [
        'test/karma.setup.js'
      ]
    }
  });

};
