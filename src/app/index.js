angular.module('civicClient', [
  // vendor modules
  'ui.router',
  'ct.ui.router.extras',
  'ui.bootstrap',
  'ui.grid',
  'ui.grid.autoResize',
  'ui.grid.pagination',
  'ui.grid.cellNav',
  'aa.formExtensions',
  'aa.formExternalConfiguration',
  'aa.notify',
  'aa.select2',
  'ngResource',
  'dialogs.main',
  'yaru22.angular-timeago',
  'angulartics',
  'angulartics.google.analytics',

  // config
  'civic.states',

  // app services
 'civic.services',
 'civic.security',
 'civic.login',
 'civic.common',
 'angular-lodash',

  // app views
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
  // (this code should be commented out before building for production!!)
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
    console.log('toState.data.navMode: ' + toState.data.navMode);
    $rootScope.view.navMode = toState.data.navMode;
    $analytics.eventTrack(toState.name);
    $analytics.pageTrack(window.location.hash);
  });

  Security.requestCurrentUser();

  // console.table($state.get());

  //  ui-router debug
  //$rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
  //  console.log('$stateChangeStart to '+ toState.name +'- fired when the transition begins. toState,toParams : \n', toState, toParams);
  //});
  //
  //$rootScope.$on('$stateChangeError',function(event, toState, toParams, fromState, fromParams){
  //  console.log('$stateChangeError - fired when an error occurs during transition.');
  //  console.log(arguments);
  //});
  //
  //$rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
  //  console.log('$stateChangeSuccess to '+toState.name+'- fired once the state transition is complete.');
  //});
  //
  //$rootScope.$on('$viewContentLoaded',function(event){
  //  console.log('$viewContentLoaded - fired after dom rendered',event);
  //});
  //
  //$rootScope.$on('$stateNotFound',function(event, unfoundState, fromState, fromParams){
  //  console.log('$stateNotFound '+unfoundState.name+'  - fired when a state cannot be found by its name.');
  //  console.log(unfoundState, fromState, fromParams);
  //});

}
// define app modules & dependencies
angular.module('civic.security', [
  'civic.security.authorization',
  'civic.security.service',
  'civic.security.interceptor',
  'civic.security.login'
]);
angular.module('civic.states', ['ui.router']);
angular.module('civic.services', []);
angular.module('civic.pages', ['civic.security.authorization', 'ui.router']);
angular.module('civic.account', ['civic.security.authorization', 'ui.router']);
angular.module('civic.common', ['ui.router']);
angular.module('civic.login', ['ui.router']);
angular.module('civic.browse', ['ui.grid.selection', 'ui.grid.pagination', 'ui.router']);
angular.module('civic.search', ['ui.router']);
angular.module('civic.events', ['ui.grid.selection', 'ui.router']);
angular.module('civic.add', ['ui.router', 'aa.select2']);

// angular.module('httpMocks', ['ngTable', 'ngMockE2E']);

// disable anchor-scrolling
angular.module('civicClient').value('$anchorScroll', angular.noop);
