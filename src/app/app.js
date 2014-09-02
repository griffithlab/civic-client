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
  ,'civic.gene'
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

function appRun(Security) {
  'use strict';
  Security.requestCurrentUser();
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
angular.module('civic.gene', []);
angular.module('civic.event', []);

angular.module('httpMocks', ['ngTable', 'ngMockE2E']);
