(function() {
  'use strict';
  angular.module('civic.events')
    .controller('GenesViewCtrl', GenesViewCtrl);

  // @ngInject
  function GenesViewCtrl($scope, $aaFormExtensions, aaLoadingWatcher, gene, geneDetails, Genes, GenesSuggestedChanges, _, $log) {
    var geneView = {};
    $scope.geneView = geneView;
    geneView.gene = gene;
    geneView.geneDetails = geneDetails;

    // get latest gene & refresh
    geneView.refresh = function() {
      geneView.gene = Genes.get({ geneId: gene.entrez_id } );
    };

    // submit changes for comment/review
    geneView.submitChange = function(geneEdit, comment) {
      $log.info('geneView.submitChange called with geneEdit: ');
      geneEdit = _.merge(gene, geneEdit);
      geneEdit.comment = comment;

      return GenesSuggestedChanges.add(geneEdit).$promise;
    };

    // apply a gene update request (admin only)
    geneView.applyChange = function(geneEdit, comment) {
      $log.info('geneView.applyEdit called.');
      gene = _.merge(gene, geneEdit);
      gene.comment = comment;

      // TODO: figure out why GeneSuggestedChanges.add() works by returning .$promise, but gene.$update() fails (but works fine if $promise is not returned)
      return gene.$update({});
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
