(function(module) {
try {
  module = angular.module('civic-client-templates');
} catch (e) {
  module = angular.module('civic-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/civic-client/login/login.html',
    '<h1>Login</h1>');
}]);
})();

(function(module) {
try {
  module = angular.module('civic-client-templates');
} catch (e) {
  module = angular.module('civic-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/civic-client/pages/home.html',
    '<h1>Home</h1><session-info></session-info>');
}]);
})();


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
function appRun($rootScope, $state, AuthService) {

}
angular.module('civic.common')
  .directive('sessionInfo', sessionInfo);

/**
 * @ngInject
 */
function sessionInfo(ConfigService, $log) {
  'use strict';
  return {
    restrict: 'EA',
    template: '<h2>CIViC Server URL: {{ conf.serverUrl }}</h2>',
    link: function(scope, element, attrs) {
      $log.info('sessionInfo directive loaded.');
      scope.conf = ConfigService;
    }
  };
}
angular.module('civic.login')
  .controller('LoginCtrl', LoginCtrl);

/**
 * @ngInject
 */
function LoginCtrl($log) {
  $log.info("LoginCtrl instantiated");
}
angular.module('civic.pages')
  .controller('HomeCtrl', HomeCtrl);

/**
 * @ngInject
 */
function HomeCtrl($log) {
  $log.info("HomeCtrl instantiated");
}
angular.module('civic.services')
  .service('AuthService', AuthService);

/**
 * @ngInject
 */
function AuthService($log) {
  $log.info('AuthService instantiated');
}
angular.module('civic.services')
  .constant('ConfigService', {
    serverUrl: 'http://localhost:3000'
  }
);

