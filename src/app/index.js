angular.module('civicClient', [
  // vendor modules
  'ui.router',
  'ct.ui.router.extras',
  'angular-loading-bar',
  'ngDialog',
  'ngMessages',
  'ui.bootstrap',
  'ui.grid',
  'ui.grid.autoResize',
  'ui.grid.pagination',
  'ui.grid.cellNav',
  'ui.gravatar',
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
  'civic.account',
  'civic.browse',
  'civic.events',
  'civic.add'
])
  .run(appRun)
  .config(appConfig);

// @ngInject
function appConfig($provide) {
  // log all rootScope events to the console for debugging
  // (this code should be commented out before building for production)
  //$provide.decorator('$rootScope', function ($delegate) {
  //  var _emit = $delegate.$emit;
  //
  //  $delegate.$emit = function () {
  //    console.log.apply(console, arguments);
  //    _emit.apply(this, arguments);
  //  };
  //
  //  return $delegate;
  //});
}

// @ngInject
function appRun(Security, $rootScope, $state, $analytics) {
  'use strict';
  $rootScope.view = {};

  // ensure $state is globally addressable/injectable
  $rootScope.$state = $state;

  $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState){
    $rootScope.view.navMode = toState.data.navMode;
    $analytics.eventTrack(toState.name);
    $analytics.pageTrack(window.location.hash);
  });

  Security.requestCurrentUser();

  // console.table($state.get());

  /*  ui-router debug logging */
  function message(to, toP, from, fromP) { return from.name  + angular.toJson(fromP) + " -> " + to.name + angular.toJson(toP); }
  $rootScope.$on("$stateChangeStart", function(evt, to, toP, from, fromP) {
    console.log("Start:   " + message(to, toP, from, fromP));
  });
  $rootScope.$on("$stateChangeSuccess", function(evt, to, toP, from, fromP) {
    console.log("Success: " + message(to, toP, from, fromP));
  });
  $rootScope.$on("$stateChangeError", function(evt, to, toP, from, fromP, err) {
    console.error("Error:   " + message(to, toP, from, fromP), err);
  });

}
// define top-level app modules & dependencies
angular.module('civic.security', [
  'civic.security.authorization',
  'civic.security.service',
  'civic.security.interceptor',
  'civic.security.login'
]);
angular.module('civic.config', []);
angular.module('civic.states', ['ui.router']);
angular.module('civic.services', ['ui.router', 'ngResource', 'angular-lodash/filters']);
angular.module('civic.pages', ['civic.security.authorization', 'ui.router']);
angular.module('civic.account', ['civic.security.authorization', 'ui.router']);
angular.module('civic.common', ['ui.router']);
angular.module('civic.login', ['ui.router']);
angular.module('civic.browse', ['ui.grid.selection', 'ui.grid.pagination', 'ui.router']);
angular.module('civic.search', ['ui.router']);

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

// disable anchor-scrolling
angular.module('civicClient').value('$anchorScroll', angular.noop);

// configure gravatar service
angular.module('ui.gravatar').config([
  'gravatarServiceProvider', function(gravatarServiceProvider) {
    gravatarServiceProvider.defaults = {
      size     : 32,
      'default': 'retro'  // retro 8-bit style as default for missing avatars
    };
  }
]);
