(function() {
  'use strict';
  angular.module('civic.common')
    .directive('cancelButton', cancelButton);

  // @ngInject
  function cancelButton() {
    return {
      restrict: 'E',
      templateUrl: 'components/directives/cancelButton.tpl.html',
      controller: cancelButtonController
    }
  }

  // @ngInject
  function cancelButtonController($scope, $state, $previousState) {
    $scope.cancel = function() {
      if($previousState.get()){
        $previousState.go();
      } else {
        $state.go('browse');
      }
    };
  }
})();
