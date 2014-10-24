angular.module('civicClient', [
  // vendor modules
  'ui.router'
  ,'ui.bootstrap'
  ,'ngTable'
  ,'ngResource'
  ,'dialogs.main'

  // http backend mocks
  ,'httpMocks'

  // config
  ,'civic.routes'

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


}

// @ngInject
function appRun(Security, $rootScope) {
  'use strict';
  $rootScope.view = {};

  $rootScope.setTitle = function (title) {
    $rootScope.view.windowTitle = 'CIViC: ' + title;
    $rootScope.view.pageTitle = title;
  };

  $rootScope.setNavMode = function(navMode) {
    $rootScope.view.navMode = navMode;
  };

  $rootScope.setTitle('Loading...');
  $rootScope.setNavMode('home');

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
angular.module('civic.event', []);

angular.module('httpMocks', ['ngTable', 'ngMockE2E']);
