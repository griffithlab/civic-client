(function() {
  'use strict';
  angular.module('civic.events.genes')
    .directive('geneSummary', function() {
      return {
        restrict: 'E',
        require: '^^entityView',
        scope: {
          showMenu: '='
        },
        link: geneSummaryLink,
        templateUrl: 'app/views/events/genes/summary/geneSummary.tpl.html'
      }
    });

  function geneSummaryLink(scope, element, attributes, entityView) {
    var geneModel,
      ctrl;

    ctrl = scope.ctrl = {};

    scope.geneModel = entityView.entityModel;

    scope.geneName = scope.geneModel.data.entity.entrez_name;
    scope.geneDescription= scope.geneModel.data.entity.description;

    var unwatch = scope.$watchCollection('geneModel', function(geneModel){
      console.log('********* geneModel $watch triggered.');
      ctrl.showMenu = scope.showMenu;

      ctrl.gene = geneModel.data.entity;
      ctrl.myGeneInfo = geneModel.data.myGeneInfo;
      ctrl.variants = geneModel.data.variants;
      ctrl.variantGroups = geneModel.data.variantGroups;
      ctrl.backgroundColor = geneModel.config.styles.view.backgroundColor;

      ctrl.variantMenuOptions = {
        styles: geneModel.config.styles.variantMenu,
        state: geneModel.config.state
      };
      unwatch();
    });
  }
})();
