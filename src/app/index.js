(function() {
  'use strict';
  angular.module('civicClient', [
    // vendor modules
    'ui.router',
    'ct.ui.router.extras',
    'angular-loading-bar',
    'mentio',
    'ngTouch',
    'ngDialog',
    'ngMessages',
    'duScroll',
    'ui.bootstrap',
    'ui.grid',
    'ui.grid.autoResize',
    'ui.grid.pagination',
    'ui.grid.cellNav',
    'ui.grid.exporter',
    'formly',
    'dialogs.main',
    'yaru22.angular-timeago',
    'angulartics',
    'angulartics.google.analytics',
    'monospaced.elastic',

    // config
    'civic.states',

    // app services
    'civic.config',
    'civic.services',
    'civic.security',
    'civic.login',
    'civic.common',
    'angular-lodash',

    // app root views
    'civic.pages',
    'civic.activity',
    'civic.search',
    'civic.account',
    'civic.browse',
    'civic.events',
    'civic.sources',
    'civic.users',
    'civic.organizations',
    'civic.add',
    'civic.community',
    'civic.curation'
  ])
    .run(appRun)
    .config(appConfig);

  // @ngInject
  function appConfig($qProvider,
                     $uiViewScrollProvider,
                     $anchorScrollProvider,
                     formlyConfigProvider,
                     $compileProvider) {
    window.apiCheck.disabled = false; // set to true in production
    $compileProvider.debugInfoEnabled(true); // set to false in production

    formlyConfigProvider.extras.removeChromeAutoComplete = true;
    $uiViewScrollProvider.useAnchorScroll();
    $anchorScrollProvider.disableAutoScrolling();
    $qProvider.errorOnUnhandledRejections(false);
  }

  // @ngInject
  function appRun(Security, $rootScope, $http, $state, $analytics, $window, $location, _) {
    $window.loading_screen.finish();
    $rootScope.view = {};

    // ensure $state is globally addressable/injectable
    $rootScope.$state = $state;

    Security.requestCurrentUser();

    // client header identifier
    $http.defaults.headers.common['Civic-Web-Client-Version'] = '0.0.6';

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if (toState.external) {
        event.preventDefault();
        $window.open(toState.url, '_blank');
      }
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState) {
      $rootScope.view.navMode = toState.data.navMode;
      if(_.isEmpty($location.hash())) { $rootScope.prevScroll = null; }
      $analytics.eventTrack(toState.name);
      $analytics.pageTrack(window.location.hash);
    });
    $rootScope.$on('$stateChangeError', function (evt, toState, params) {
      $rootScope._civicStateError = _.merge(params, {
        'stateName': toState.name
      });
      $state.go('home');
    });
    $rootScope.$on('duScrollspy:becameActive', function($event, $element){
      //Automatically update location
      var hash = $element.prop('hash');
      if (hash) {
        // jshint unused:false
        window.history.replaceState(null, null, hash);
      }
    });
    /*  ui-router debug logging - uncomment these if you run into links/routes silently failing. */
    // function message(to, toP, from, fromP) {
    //   return from.name + angular.toJson(fromP) + ' -> ' + to.name + angular.toJson(toP);
    // }

    // $rootScope.$on('$stateChangeStart', function (evt, to, toP, from, fromP) {
    //   console.log('Start:   ' + message(to, toP, from, fromP));
    // });
    // $rootScope.$on('$stateChangeSuccess', function (evt, to, toP, from, fromP) {
    //   console.log('Success: ' + message(to, toP, from, fromP));
    // });
    // $rootScope.$on('$stateChangeError', function (evt, to, toP, from, fromP, err) {
    //   console.error('Error:   ' + message(to, toP, from, fromP), err);
    // });

  }

  // define root modules & dependencies
  angular.module('civic.security', [
    'civic.security.authorization',
    'civic.security.service',
    'civic.security.interceptor',
    'civic.security.login'
  ]);
  angular.module('civic.config', ['formly', 'formlyBootstrap']);
  angular.module('civic.states', ['ui.router']);
  angular.module('civic.sources', []);
  angular.module('civic.services', ['ui.router', 'ngResource', 'angular-lodash/filters']);
  angular.module('civic.pages', ['civic.security.authorization', 'ui.router']);
  angular.module('civic.account', ['civic.security.authorization', 'ui.router']);
  angular.module('civic.common', ['ui.router']);
  angular.module('civic.login', ['ui.router']);
  angular.module('civic.browse', ['ui.grid.selection', 'ui.grid.pagination', 'ui.router']);
  angular.module('civic.search', ['ui.router']);
  angular.module('civic.activity', ['ui.router']);
  angular.module('civic.community', ['ui.router']);
  angular.module('civic.curation', ['ui.router']);

  angular.module('civic.users', [
    'ui.router',
    'civic.users.profile',
    'civic.users.common'
  ]);
  angular.module('civic.organizations', []);

  angular.module('civic.add', [
    'ui.router',
    'formly',
    'formlyBootstrap',
    'civic.add.evidence'
  ]);

  angular.module('civic.events', [
    'ui.router',
    'ui.grid',
    'ngDialog',
    'formly',
    'formlyBootstrap',
    'angular-lodash/filters',
    'civic.events.common',
    'civic.events.genes',
    'civic.events.assertions',
    'civic.events.variants',
    'civic.events.variantGroups',
    'civic.events.evidence'
  ]);

})();
