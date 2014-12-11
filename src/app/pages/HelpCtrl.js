(function() {
  'use strict';
  angular.module('civic.pages')
    .controller('HelpCtrl', HelpCtrl);

  // @ngInject
  function HelpCtrl($scope, $rootScope, $log) {
    $log.info('HelpCtrl loaded.');
    $scope.loadedMsg = 'Loaded Help!';
  }
})();
