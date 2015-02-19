(function() {
  'use strict';
  angular.module('civic.events')
    .controller('GenesViewCtrl', GenesViewCtrl);

  // @ngInject
  function GenesViewCtrl($scope, gene, geneDetails, Genes, GenesSuggestedChanges, GeneComments, GenesSuggestedChangesComments, _, $log) {
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
      $log.info('geneView.submitChange called.');
      geneEdit = _.merge(gene, geneEdit);
      geneEdit.comment = comment;

      return GenesSuggestedChanges.add(geneEdit).$promise;
    };

    // immediately apply a gene edit (admin only)
    geneView.applyChange = function(geneEdit, comment) {
      $log.info('geneView.applyEdit called.');
      gene = _.merge(gene, geneEdit);
      gene.comment = comment;

      // TODO: figure out why GeneSuggestedChanges.add() works when returning .$promise, but gene.$update() doesn't
      return gene.$update({});
    };

    // add a comment to to current gene
    geneView.addComment = function(comment) {
      $log.info('geneView.addComment called.');
      $log.info('comment: ' + comment);
      return GeneComments.add({
        entrez_id: gene.entrez_id,
        title: comment.title || "Gene " + gene.entrez_name + " Comment",
        text: comment.text
      }).$promise;
    };

    // fetch gene changes
    geneView.getChanges = function(suggestedChangeId) {
      if(!suggestedChangeId) { // no change ID supplied, so we're fetching all changes
        return GenesSuggestedChanges.query({
          'geneId': gene.entrez_id
        }).$promise;
      } else {
        return GenesSuggestedChanges.get({
          geneId: gene.entrez_id,
          suggestedChangeId: suggestedChangeId
        }).$promise;
      }
    };

    // fetch gene change comments
    geneView.getChangeComments = function(suggestedChangeId) {
      return GenesSuggestedChangesComments.query({
        'geneId': gene.entrez_id,
        'suggestedChangeId': suggestedChangeId
      }).$promise;
    };

    // add a change comment
    geneView.addChangeComment = function(suggestedChangeId, comment) {
      return GenesSuggestedChangesComments.add({
        'geneId': gene.entrez_id,
        'suggestedChangeId': suggestedChangeId
      }, comment).$promise;
    };

    // accept a gene update request to current gene
    geneView.acceptChange = function(suggestedChangeId) {
      $log.info('geneView.acceptChange called.');
      $log.info('changeId: ' + suggestedChangeId);

      return GenesSuggestedChanges.accept({
        'entrez_id': gene.entrez_id,
        'suggestedChangeId': suggestedChangeId,
        force: true
      }).$promise;
    };

    // reject a gene update request to current gene
    geneView.rejectChange = function(suggestedChangeId) {
      $log.info('geneView.rejectChange called.');
      $log.info('suggestedChangeId: ' + suggestedChangeId);
      return GenesSuggestedChanges.reject({
        'entrez_id': gene.entrez_id,
        'suggestedChangeId': suggestedChangeId,
        force: true
      }).$promise;
    };

  }
})();
