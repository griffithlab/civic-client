angular.module('civicClient', [
  'ui.router'
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
 * @ngInject
 * @param $stateProvider
 * @param $urlRouterProvider
 */
function appConfig($stateProvider, $urlRouterProvider ) {
  $stateProvider
    .state('home', {
      url: '/home',
      controller: 'HomeCtrl',
      templateUrl: '/civic-client/pages/home.html',
      authenticate: true
    })
    .state("login", {
      url: "/login",
      templateUrl: "/civic-client/login/login.html",
      controller: "LoginCtrl",
      authenticate: false
    });
  // Send to login if the URL was not found
  $urlRouterProvider.otherwise("/home");
}

/**
 * @ngInject
 */
function appRun($rootScope, $state, AuthService) {

}