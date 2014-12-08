(function() {
  'use strict';
  angular.module('civic.pages')
    .controller('HelpCtrl', HelpCtrl);

  // @ngInject
  function HelpCtrl($scope, $rootScope, $log) {
    $log.info('HelpCtrl loaded.');
    $rootScope.setNavMode('sub');
    $scope.loadedMsg = 'Loaded Help!';
  }
})();
