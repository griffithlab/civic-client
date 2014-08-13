angular.module('civicClient', [
  'ui.router'
  ,'ui.bootstrap'
  ,'dialogs.main'
  ,'civic.pages'
  ,'civic.security'
  ,'civic.services'
  ,'civic.common'
  ,'civic.pages'
  ,'civic.login'
  ,'civic-client-templates'
])
  .config(appConfig);

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
 * @param $log
 * @param $stateProvider
 * @param $urlRouterProvider
 * @ngInject
 *
 */
function appConfig($stateProvider, $urlRouterProvider ) {
  'use strict';
  console.log('appConfig() called.');
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: '/civic-client/login/login.html',
      controller: 'LoginCtrl'
    });
  // Send to login if the URL was not found
//  $urlRouterProvider.otherwise('/login');
}
