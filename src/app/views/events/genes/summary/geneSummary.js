(function() {
  'use strict';
  angular.module('civic.events.genes')
    .directive('geneSummary', function() {
      return {
        restrict: 'E',
        scope: {
          showMenu: '='
        },
        link: geneSummaryLink,
        controller: GeneSummaryController,
        templateUrl: 'app/views/events/genes/summary/geneSummary.tpl.html'
      }
    });

  function geneSummaryLink(scope, element, attributes, entityView) {


    //scope.$watchCollection('geneModel', function(geneModel){
    //  console.log('********* geneSummaryLink: geneModel $watch triggered.');
    //  ctrl.showMenu = scope.showMenu;
    //
    //  ctrl.gene = geneModel.data.entity;
    //  ctrl.myGeneInfo = geneModel.data.myGeneInfo;
    //  ctrl.variants = geneModel.data.variants;
    //  ctrl.variantGroups = geneModel.data.variantGroups;
    //  ctrl.backgroundColor = geneModel.config.styles.view.backgroundColor;
    //
    //  ctrl.variantMenuOptions = {
    //    styles: geneModel.config.styles.variantMenu,
    //    state: geneModel.config.state
    //  };
    //});
  }

  function GeneSummaryController($scope, Genes, genesViewOptions) {
    $scope.geneModel = Genes;

    $scope.geneConfig = genesViewOptions;

    $scope.geneName = scope.geneModel.data.item.entrez_name;
    $scope.geneDescription= scope.geneModel.data.item.description;
  }
})();
