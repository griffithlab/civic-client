(function() {
  'use strict';
  angular.module('civic.common')
    .directive('evidenceSelectorItem', evidenceSelectorItem);

  // @ngInject
  function evidenceSelectorItem() {
    return {
      restrict: 'E',
      scope: {
        item: '=',
        removeFn: '='
      },
      templateUrl: 'components/directives/evidenceSelectorItem.tpl.html',
      controller: evidenceSelectorItemController
    };
  }

  // @ngInject
  function evidenceSelectorItemController($scope, $state, _) {
    var ctrl = $scope.ctrl = {};
    ctrl.item = $scope.item;
    ctrl.removeItem = $scope.removeFn;
  }
})();
