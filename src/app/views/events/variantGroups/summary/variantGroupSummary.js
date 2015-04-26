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
    scope.ctrl = {};
    scope.ctrl.variantGroupModel = entityView.entityModel;
  }

  //@ngInject
  function VariantGroupSummaryController($scope) {
    var unwatch = $scope.$watchCollection('ctrl.variantGroupModel', function(entityModel){
      var config, data, ctrl;

      config = entityModel.config;
      data = entityModel.data;
      ctrl = $scope.ctrl;

      ctrl.variantGroup = data.entity;
      ctrl.geneId = data.geneId;
      ctrl.variants = data.variants;

      // unbind watcher after first digest
      unwatch();
    }, true);
  }
})();
