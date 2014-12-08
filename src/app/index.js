angular.module('civicClient', [
  // vendor modules
  'ui.router',
  'ct.ui.router.extras',
  'ui.bootstrap',
  'ui.grid',
  'ui.grid.autoResize',
  'ngTagsInput',
  'ngResource',
  'dialogs.main',

  // http backend mocks
  //,'httpMocks'

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
  //,'civic-client-templates'
])
  .run(appRun);

// @ngInject
function appRun(Security, $rootScope, $state, $log) {
  'use strict';

  $rootScope.view = {};

  $rootScope.setTitle = function (title) {

  };
  $rootScope.setNavMode = function(navMode) {
    $rootScope.view.navMode = navMode;
  };

  $rootScope.setNavMode('home');

  // make $state globally addressable/injectable
  $rootScope.$state = $state;

  Security.requestCurrentUser();

  // ui-router debug
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
// define app modules
angular.module('civic.security', [
  'civic.security.authorization',
  'civic.security.service',
  'civic.security.interceptor',
  'civic.security.login'
]);
angular.module('civic.services', []);
angular.module('civic.pages', ['civic.security.authorization']);
angular.module('civic.account', ['civic.security.authorization']);
angular.module('civic.common', []);
angular.module('civic.login', []);
angular.module('civic.browse', ['ui.grid.selection']);
angular.module('civic.search', []);
angular.module('civic.events', []);

angular.module('httpMocks', ['ngTable', 'ngMockE2E']);
