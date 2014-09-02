angular.module('civicClient', [
  // vendor modules
  'ui.router'
  ,'ui.bootstrap'
  ,'ngTable'
  ,'ngResource'
  ,'dialogs.main'

  // http backend mocks
  ,'httpMocks'

  // app services
  ,'civic.services'
  ,'civic.security'
  ,'civic.login'
  ,'civic.common'

  // app views
  ,'civic.pages'
  ,'civic.account'
  ,'civic.browse'
  ,'civic.event'
  ,'civic-client-templates'
])
  .config(appConfig)
  .run(appRun);

/**
 * @name appConfig
 * @desc Config function for main app
 * @param $log
 * @param $stateProvider
 * @param $urlRouterProvider
 * @ngInject
 *
 */
function appConfig($stateProvider, $urlRouterProvider) {
  'use strict';
  // route to home state if no state supplied
  $urlRouterProvider.otherwise('home');
}

// @ngInject
function appRun(Security, $rootScope) {
  'use strict';
  Security.requestCurrentUser();

  $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
    console.log('$stateChangeStart to '+toState.name +'- fired when the transition begins. toState,toParams : \n',toState, toParams);

    $rootScope.$on('$stateChangeError',function(event, toState, toParams, fromState, fromParams){
      console.log('$stateChangeError - fired when an error occurs during transition.');
      console.log(arguments);
    });
  });
}

// define app modules
angular.module('civic.security', [
  'civic.security.authorization'
  ,'civic.security.service'
  ,'civic.security.interceptor'
  ,'civic.security.login'
]);
angular.module('civic.services', []);
angular.module('civic.pages', ['civic.security.authorization']);
angular.module('civic.account', ['civic.security.authorization']);
angular.module('civic.common', []);
angular.module('civic.login', []);
angular.module('civic.browse', []);
angular.module('civic.search', []);
angular.module('civic.event', []);

angular.module('httpMocks', ['ngTable', 'ngMockE2E']);
