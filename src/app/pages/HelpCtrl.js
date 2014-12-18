(function() {
  'use strict';
  angular.module('civic.pages')
    .controller('HelpCtrl', HelpCtrl);

  // @ngInject
  function HelpCtrl($scope) {
    $scope.loadedMsg = 'Loaded Help!';
  }
})();
