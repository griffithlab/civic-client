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
    };
  }

  // @ngInject
  function cancelButtonController($scope, $state, $previousState, $window) {
    $scope.cancel = function() {
      $previousState.get() ? $window.history.back() : $state.go('home');
    };
  }
})();
