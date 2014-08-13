angular.module('civic.pages', ['civic.security.authorization'])
  .config(pagesConfig);

// @ngInject
function pagesConfig($stateProvider, $urlRouterProvider, AuthService) {
  'use strict';
  console.log('pagesConfig called.');
  $stateProvider.state('home', {
    url: '/home',
    controller: 'HomeCtrl',
    templateUrl: '/civic-client/pages/home.html'
    resolve: AuthService.requireAuthenticatedUser
  });
}
