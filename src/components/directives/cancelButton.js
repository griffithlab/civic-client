(function() {
  'use strict';
  angular.module('civic.common')
    .directive('cancelButton', cancelButton);

  // @ngInject
  function cancelButton() {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'components/directives/cancelButton.tpl.html',
      controller: cancelButtonController
    }
  }

  // @ngInject
  function cancelButtonController($scope, $state, $previousState) {
    $scope.cancel = function() {
      $previousState.get() ? $previousState.go() : $state.go('browse');
    };
  }
})();
