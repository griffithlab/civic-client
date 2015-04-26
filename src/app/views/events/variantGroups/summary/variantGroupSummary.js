(function() {
  'use strict';
  angular.module('civic.events.variantGroups')
    .controller('VariantGroupSummaryController', VariantGroupSummaryController)
    .directive('variantGroupSummary', function() {
      return {
        restrict: 'E',
        require: '^^entityView',
        scope: {},
        link: VariantGroupSummaryLink,
        controller: 'VariantGroupSummaryController',
        templateUrl: 'app/views/events/variantGroups/summary/variantGroupSummary.tpl.html'
      }
    });

  function VariantGroupSummaryLink(scope, element, attributes, entityView) {
    scope.variantGroupModel = entityView.entityModel;
  }

  //@ngInject
  function VariantGroupSummaryController($scope) {
    var ctrl = $scope.ctrl = {};
    $scope.variantGroupModel = {};

    var unwatch = $scope.$watchCollection('variantGroupModel', function(variantGroupModel){
      ctrl.variantGroupModel = variantGroupModel;
      ctrl.variantGroup = variantGroupModel.data.entity;
      // unbind watcher after first digest
      unwatch();
    }, true);
  }
})();
