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
    scope.ctrl = {};
    scope.ctrl.entityModel = entityView.entityModel;
  }

  //@ngInject
  function VariantSummaryController($scope) {
    var unwatch = $scope.$watch('ctrl.entityModel', function(entityModel){
      var config, data, ctrl;

      ctrl = $scope.ctrl;
      data = entityModel.data;

      ctrl.styles = entityModel.config.styles;
      ctrl.variant = data.entity;
      ctrl.gene = data.parent;
      ctrl.evidenceItems = entityModel.data.evidenceItems;

      // unbind watcher after first digest
      unwatch();
    }, true);
  }
})();
