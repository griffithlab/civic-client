(function() {
  'use strict';
  angular.module('civic.events')
    .controller('GenesViewCtrl', GenesViewCtrl);

  // @ngInject
  function GenesViewCtrl($scope, gene, geneDetails, Genes, $stateParams) {
    var geneView = $scope.geneView = {};
    geneView.gene = gene;
    geneView.geneDetails = geneDetails;
    geneView.variantGroupsExist = _.has(gene, 'variant_groups') && gene.variant_groups.length > 0;

    // get latest gene & refresh
    geneView.refreshGene = function() {
      geneView.gene = Genes.get({ geneId: gene.entrez_id } );
    };

    // submit changes for comment/review
    geneView.submitGeneChange = function() {

    };

    // directly update a gene (admin only)
    geneView.applyEdit = function() {

    };

    // apply a gene update request (admin only)
    geneView.applyGeneChange = function() {

    };

    // reject a gene update request (admin only)
    geneView.rejectGeneChange = function() {

    };

    // add a comment to current gene
    geneView.submitGeneComment = function() {

    };
  }
})();
