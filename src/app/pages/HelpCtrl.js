(function() {
  'use strict';
  angular.module('civic.pages')
    .controller('HelpCtrl', HelpCtrl);

  function HelpCtrl($scope, $rootScope, $log) {
    $log.info('HelpCtrl loaded.');
    $rootScope.setNavMode('sub');
    $rootScope.setTitle('Help');

    $scope.loadedMsg = 'Loaded Help!';
  }
})();