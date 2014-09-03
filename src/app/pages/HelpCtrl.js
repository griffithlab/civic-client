(function() {
  'use strict';
  angular.module('civic.pages')
    .controller('HelpCtrl', HelpCtrl);

  function HelpCtrl($scope, $rootScope, $log) {
    $log.info('HelpCtrl loaded.');
    $rootScope.navMode = 'sub';
    $rootScope.viewTitle = 'Help';
    $scope.loadedMsg = 'Loaded Help!';
  }
});