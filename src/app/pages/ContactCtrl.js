(function() {
  'use strict';
  angular.module('civic.pages')
    .controller('ContactCtrl', ContactCtrl);

  // @ngInject
  function ContactCtrl($scope) {
    $scope.loadedMsg = 'Loaded Contact!';
  }
})();
