(function() {
  'use strict';
  angular
    .module('civic.pages')
    .controller('AuthTestCtrl', AuthTestCtrl);

  function AuthTestCtrl ($scope, $rootScope, $log) {
    $log.info('AuthTestCtrl loaded.');
    $rootScope.navMode = 'sub';
    $rootScope.viewTitle = 'AuthTest';
    $scope.loadedMsg = 'Loaded AuthTest!';
  }
})();