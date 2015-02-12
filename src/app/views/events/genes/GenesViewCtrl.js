(function() {
  'use strict';
  angular.module('civic.events')
    .controller('GenesViewCtrl', GenesViewCtrl);

  // @ngInject
  function GenesViewCtrl($scope, gene, geneDetails, Genes, GenesSuggestedChanges, $log) {
    var geneView = $scope.geneView = {};
    geneView.gene = gene;
    geneView.geneDetails = geneDetails;
    geneView.variantGroupsExist = _.has(geneView.gene, 'variant_groups') && geneView.gene.variant_groups.length > 0;

    // get latest gene & refresh
    geneView.refresh = function() {
      geneView.gene = Genes.get({ geneId: gene.entrez_id } );
    };

    // submit changes for comment/review
    geneView.submitChange = function() {
      $log.info('geneView.submitEdit called.');
    };

    // apply a gene update request (admin only)
    geneView.applyChange = function() {
      $log.info('geneView.applyEdit called.');
    };

    // reject a gene update request (admin only)
    geneView.rejectChange = function() {
      $log.info('geneView.rejectChange called.');
    };

    // add a comment to current gene
    geneView.submitComment = function() {
      $log.info('geneView.submitComment called.');
    };
  }
})();
