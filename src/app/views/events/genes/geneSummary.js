(function() {
  'use strict';
  angular.module('civic.events.genes')
    .controller('GeneSummaryController', GeneSummaryController)
    .directive('geneSummary', function() {
      return {
        restrict: 'E',
        require: '^^entityView',
        scope: {},
        link: GeneSummaryLink,
        controller: 'GeneSummaryController',
        templateUrl: 'app/views/events/genes/geneSummary.tpl.html'
      }
    });

  function GeneSummaryLink(scope, element, attributes, entityView) {
    scope.ctrl = {};
    scope.ctrl.entityModel = entityView.entityModel;
  }

  //@ngInject
  function GeneSummaryController($scope) {
    var unbindModelWatch = $scope.$watch('ctrl.entityModel', function(entityModel){
      var ctrl = $scope.ctrl;
      ctrl.gene = ctrl.entityModel.data.entity;
      ctrl.myGeneInfo = ctrl.entityModel.data.myGeneInfo;
      ctrl.variants = ctrl.entityModel.data.variants;
      ctrl.variantGroups = ctrl.entityModel.data.variantGroups;

      unbindModelWatch();
    }, true);
  }
})();
