(function() {
  'use strict';
  angular.module('civic.pages')
    .controller('ContactCtrl', ContactCtrl);

  function ContactCtrl($scope, $rootScope, $log) {
    $log.info('ContactCtrl loaded.');
    $rootScope.navMode = 'sub';
    $rootScope.viewTitle = 'Contact';
    $scope.loadedMsg = 'Loaded Contact!';
  }
})();