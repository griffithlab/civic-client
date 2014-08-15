angular.module('civic.pages')
  .controller('HomeCtrl', HomeCtrl);

/**
 * @ngInject
 */
function HomeCtrl($rootScope, $scope, $log) {
  $log.info("HomeCtrl instantiated");
  'use strict';
  $rootScope.navMode = 'home';
  $rootScope.viewTitle = 'Home';
  console.log('HomeController loaded.');
  $scope.loadedMsg = 'Loaded Home!';
}

