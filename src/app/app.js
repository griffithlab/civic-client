angular.module('civicClient', [
  'ui.router'
  ,'ui.bootstrap'
  ,'dialogs.main'
  ,'civic.pages'
  ,'civic.security'
  ,'civic.services'
  ,'civic.common'
  ,'civic.login'
  ,'civic-client-templates'
])
  .config(appConfig);

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
  console.info('appConfig() called.');
  $urlRouterProvider.otherwise('home');
}

// define app modules
angular.module('civic.security', [
  'civic.security.authorization'
  ,'civic.security.service'
  ,'civic.security.interceptor'
  ,'civic.security.login'
]);
angular.module('civic.services', []);
angular.module('civic.pages', ['civic.security.authorization'])
angular.module('civic.common', []);
angular.module('civic.login', []);
angular.module('civic.browse', []);
angular.module('civic.search', []);
angular.module('civic.gene', []);
angular.module('civic.event', []);
angular.module('civic.evidence', []);
