(function() {
  'use strict';
  angular.module('civicClient', [
    // vendor modules
    'ui.router',
    'ct.ui.router.extras',
    'angular-loading-bar',
    'ngTouch',
    'ngDialog',
    'ngMessages',
    'duScroll',
    'ui.bootstrap',
    'ui.grid',
    'ui.grid.autoResize',
    'ui.grid.pagination',
    'ui.grid.cellNav',
    'formly',
    'dialogs.main',
    'yaru22.angular-timeago',
    'angulartics',
    'angulartics.google.analytics',

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
    'civic.users',
    'civic.add',
    'civic.community'
  ])
    .run(appRun)
    .config(appConfig);

// @ngInject
  function appConfig($uiViewScrollProvider, $anchorScrollProvider, formlyConfigProvider) {
    window.apiCheck.disabled = false; // set to true in production
    formlyConfigProvider.removeChromeAutoCompletee = true;
    $uiViewScrollProvider.useAnchorScroll();
    $anchorScrollProvider.disableAutoScrolling();
  }

// @ngInject
  function appRun(Security, $rootScope, $state, $analytics, $location, _) {
    $rootScope.view = {};

    // ensure $state is globally addressable/injectable
    $rootScope.$state = $state;

    $rootScope.$on('$stateChangeSuccess', function (event, toState) {
      $rootScope.view.navMode = toState.data.navMode;
      if(_.isEmpty($location.hash())) { $rootScope.prevScroll = null; }
      $analytics.eventTrack(toState.name);
      $analytics.pageTrack(window.location.hash);
    });

    Security.requestCurrentUser();

    /*  ui-router debug logging */
    //function message(to, toP, from, fromP) {
    //  return from.name + angular.toJson(fromP) + ' -> ' + to.name + angular.toJson(toP);
    //}
    //
    //$rootScope.$on('$stateChangeStart', function (evt, to, toP, from, fromP) {
    //  console.log('Start:   ' + message(to, toP, from, fromP));
    //});
    //$rootScope.$on('$stateChangeSuccess', function (evt, to, toP, from, fromP) {
    //  console.log('Success: ' + message(to, toP, from, fromP));
    //});
    //$rootScope.$on('$stateChangeError', function (evt, to, toP, from, fromP, err) {
    //  console.error('Error:   ' + message(to, toP, from, fromP), err);
    //});

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
  angular.module('civic.services', ['ui.router', 'ngResource', 'angular-lodash/filters']);
  angular.module('civic.pages', ['civic.security.authorization', 'ui.router']);
  angular.module('civic.account', ['civic.security.authorization', 'ui.router']);
  angular.module('civic.common', ['ui.router']);
  angular.module('civic.login', ['ui.router']);
  angular.module('civic.browse', ['ui.grid.selection', 'ui.grid.pagination', 'ui.router']);
  angular.module('civic.search', ['ui.router']);
  angular.module('civic.activity', ['ui.router']);
  angular.module('civic.community', ['ui.router']);

  angular.module('civic.users', [
    'ui.router',
    'civic.users.profile',
    'civic.users.common'
  ]);

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
    'civic.events.variants',
    'civic.events.variantGroups',
    'civic.events.evidence'
  ]);

})();
