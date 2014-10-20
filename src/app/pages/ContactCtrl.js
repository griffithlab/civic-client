(function() {
  'use strict';
  angular.module('civic.pages')
    .controller('ContactCtrl', ContactCtrl);

  function ContactCtrl($scope, $rootScope, $log) {
    $log.info('ContactCtrl loaded.');
    $rootScope.setNavMode('sub');
    $rootScope.setTitle('Contact');
    $scope.loadedMsg = 'Loaded Contact!';
  }
})();