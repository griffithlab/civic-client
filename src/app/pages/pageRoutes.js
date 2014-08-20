angular.module('civic.pages')
  .config(pageRoutes);

// @ngInject
function pageRoutes($stateProvider) {
  'use strict';
  $stateProvider
    .state('home', {
      url: '/home',
      controller: 'HomeCtrl',
      templateUrl: '/civic-client/pages/home.tpl.html'
    })
    .state('collaborate', {
      url: '/collaborate',
      controller: 'CollaborateCtrl',
      templateUrl: '/civic-client/pages/collaborate.tpl.html'
    })
    .state('help', {
      url: '/help',
      controller: 'HelpCtrl',
      templateUrl: '/civic-client/pages/help.tpl.html'
    })
    .state('contact', {
      url: '/contact',
      controller: 'ContactCtrl',
      templateUrl: '/civic-client/pages/contact.tpl.html'
    });
}
