(function() {
  'use strict';
  angular.module('civic.events.genes')
    .controller('GeneSummaryController', GeneSummaryController)
    .directive('geneSummary', function() {
      return {
        restrict: 'E',
        require: '^^entityView',
        scope: {
          showMenu: '='
        },
        controller: 'GeneSummaryController',
        link: geneSummaryLink,
        templateUrl: 'app/views/events/genes/summary/geneSummary.tpl.html'
      }
    });

  function geneSummaryLink(scope, element, attributes, entityView) {
    scope.geneModel = entityView.entityModel;
  }

  //@ngInject
  function GeneSummaryController($scope) {
    var ctrl = $scope.ctrl = {};
    $scope.geneModel = {};

    var unwatch = $scope.$watch('geneModel', function(geneModel) {
      console.log('*** geneSummary watchCollection triggered. ***');
      ctrl.gene = geneModel.data.entity;
      ctrl.myGeneInfo = geneModel.data.myGeneInfo;
      ctrl.variants = geneModel.data.variants;
      ctrl.variantGroups = geneModel.data.variantGroups;
      ctrl.backgroundColor = geneModel.config.styles.view.backgroundColor;
      ctrl.showMenu = $scope.showMenu;

      ctrl.variantMenuOptions = {
        gene: ctrl.gene,
        styles: geneModel.config.styles.variantMenu,
        state: geneModel.config.state,
      };
      // unwatch();
    }, true);
  }
})();
