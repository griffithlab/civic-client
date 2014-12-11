(function() {
  'use strict';
  angular.module('civic.pages')
    .controller('ContactCtrl', ContactCtrl);

  // @ngInject
  function ContactCtrl($scope, $rootScope, $log) {
    $log.info('ContactCtrl loaded.');
    $scope.loadedMsg = 'Loaded Contact!';
  }
})();
