(function() {
  'use strict';
  angular.module('civic.events.common')
    .directive('entitySummary', function() {
      return {
        restrict: 'E',
        transclude: true,
        require: '^^entityView',
        scope: {},
        link: entitySummaryLink,
        templateUrl: 'app/views/events/common/state/entitySummary.tpl.html'
      }
    });

  function entitySummaryLink(scope, element, attributes, entityView) {
    scope.entityModel = entityView.entityModel;
  }

  function EntitySummaryController($scope) {
    var ctrl = $scope.ctrl = {};
    $scope.$watch('entityModel', function(entityModel) {
      ctrl.entityModel = entityModel;
    });
  }
})();
