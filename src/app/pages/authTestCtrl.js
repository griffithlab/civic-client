(function() {
  'use strict';
  angular
    .module('civic.pages')
    .controller('AuthTestCtrl', AuthTestCtrl);

  // @ngInject
  function AuthTestCtrl ($scope) {
    $scope.loadedMsg = 'Loaded AuthTest!';
  }
})();
