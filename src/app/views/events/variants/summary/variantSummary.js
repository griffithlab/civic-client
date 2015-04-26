(function() {
  'use strict';
  angular.module('civic.events.variants')
    .controller('VariantSummaryController', VariantSummaryController)
    .directive('variantSummary', function() {
      return {
        restrict: 'E',
        require: '^^entityView',
        scope: {},
        link: VariantSummaryLink,
        controller: 'VariantSummaryController',
        templateUrl: 'app/views/events/variants/summary/variantSummary.tpl.html'
      }
    });

  function VariantSummaryLink(scope, element, attributes, entityView) {
    scope.variantModel = entityView.entityModel;
  }

  //@ngInject
  function VariantSummaryController($scope) {
    var ctrl = $scope.ctrl = {};
    $scope.variantModel = {};

    var unwatch = $scope.$watchCollection('variantModel', function(variantModel){
      ctrl.variantModel = variantModel;
      ctrl.variantDescription = variantModel.data.entity.description;

      // unbind watcher after first digest
      unwatch();
    }, true);
  }
})();
