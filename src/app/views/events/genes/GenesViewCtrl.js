(function() {
  'use strict';
  angular.module('civic.events')
    .controller('GenesViewCtrl', GenesViewCtrl);

  // @ngInject
  function GenesViewCtrl($scope, gene, geneDetails, Genes, GenesSuggestedChanges, _, $log) {
    var geneView = $scope.geneView = {};
    geneView.gene = gene;
    geneView.geneDetails = geneDetails;
    geneView.variantGroupsExist = _.has(geneView.gene, 'variant_groups') && geneView.gene.variant_groups.length > 0;

    // get latest gene & refresh
    geneView.refresh = function() {
      geneView.gene = Genes.get({ geneId: gene.entrez_id } );
    };

    // submit changes for comment/review
    geneView.submitChange = function(geneEdit) {
      $log.info('geneView.submitEdit called with geneEdit: ');
      $log.info(geneEdit);
      geneEdit.formStatus.messages.push('submitChange called.');
    };

    // apply a gene update request (admin only)
    geneView.applyChange = function(geneEdit) {
      $log.info('geneView.applyEdit called.');
      gene = _.merge(gene, geneEdit);
      gene.$update({},
        function(value, responseHeaders) { // success
          $log.info('Gene updated successfully.');
        },
        function(response) { // failure
          $log.warn('Gene update failed.');
      });
    };

    // reject a gene update request (admin only)
    geneView.rejectChange = function() {
      $log.info('geneView.rejectChange called.');
    };

    // discard gene changes and return to gene summary
    geneView.discardChange = function() {
      $log.info('geneView.discardChange called.');
    };


    // add a comment to current gene
    geneView.submitComment = function() {
      $log.info('geneView.submitComment called.');
    };
  }
})();
