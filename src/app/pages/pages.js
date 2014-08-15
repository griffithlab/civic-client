angular.module('civic.pages')
  .config(pagesConfig);

// @ngInject
function pagesConfig($stateProvider, AuthorizationProvider) {
  'use strict';
  $stateProvider
    .state('home', {
      url: '/home',
      controller: 'HomeCtrl',
      templateUrl: '/civic-client/pages/home/home.tpl.html'
    })
    .state('authTest', {
      url: '/authTest',
      controller: 'AuthTestCtrl',
      templateUrl: '/civic-client/pages/authTest/authTest.tpl.html',
      resolve: {
        authorized: AuthorizationProvider.requireAuthenticatedUser
      }
    });
}
