angular.module('civic.pages')
  .config(pagesConfig);

// @ngInject
function pagesConfig($stateProvider, AuthorizationProvider) {
  'use strict';
  console.info('pagesConfig() called.');
  $stateProvider.state('home', {
    url: '/home',
    controller: 'HomeCtrl',
    templateUrl: '/civic-client/pages/home.html',
    resolve: {
      authorized: AuthorizationProvider.requireAuthenticatedUser
    }
  });
}
