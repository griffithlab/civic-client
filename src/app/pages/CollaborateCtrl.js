angular
  .module('civic.pages')
  .controller('CollaborateCtrl', CollaborateCtrl);

// @ngInject
function CollaborateCtrl ($scope, $rootScope, $log) {
  'use strict';
  $log.info('CollaborateCtrl loaded.');
  $rootScope.navMode = 'sub';
  $rootScope.viewTitle = 'Collaborate';
  $scope.loadedMsg = 'Loaded Collaborate!';
}
