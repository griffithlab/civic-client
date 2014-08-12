angular.module('civicClient', [
  'ui.router'
  ,'ui.bootstrap'
  ,'dialogs.main'
  ,'civic.security'
  ,'civic.services'
  ,'civic.common'
  ,'civic.pages'
  ,'civic.login'
  ,'civic-client-templates'
])
  .config(appConfig)
  .run(appRun);

angular.module('civic.services', []);
angular.module('civic.common', []);
angular.module('civic.pages', []);
angular.module('civic.login', []);
angular.module('civic.browse', []);
angular.module('civic.search', []);
angular.module('civic.gene', []);
angular.module('civic.event', []);
angular.module('civic.evidence', []);

/**
 * @name appConfig
 * @desc Config function for main app
 * @param $stateProvider
 * @param $urlRouterProvider
 * @ngInject
 *
 */
function appConfig($stateProvider, $urlRouterProvider ) {
  'use strict';
  $stateProvider
    .state('home', {
      url: '/home',
      controller: 'HomeCtrl',
      templateUrl: '/civic-client/pages/home.html',
      authenticate: true
    })
    .state('login', {
      url: '/login',
      templateUrl: '/civic-client/login/login.html',
      controller: 'LoginCtrl',
      authenticate: false
    });
  // Send to login if the URL was not found
  $urlRouterProvider.otherwise('/home');
}

/**
 * @name appRun
 * @desc run function for main app
 * @ngInject
 */
function appRun($rootScope, $state) {
//  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
//    if (toState.authenticate && !AuthService.isAuthenticated()){
//      // User isn’t authenticated
//      $state.transitionTo("login");
//      event.preventDefault();
//    }
//  });
}