(function() {
  'use strict';
  angular.module('civic.events')
    .controller('GeneEditCtrl', GeneEditCtrl);

  // @ngInject
  function GeneEditCtrl($log, $rootScope, $scope, $stateParams, Genes) {
    $log.info("GeneEditCtrl loaded.");
    $rootScope.setNavMode('sub');
    $rootScope.setTitle('Edit Gene ' + $stateParams.geneId);

    $scope.geneEdit = Genes.get({'geneId': $stateParams.geneId });

    $scope.tags = {
      protein_motifs: function(query) {
        return Genes.protein_motifs({ filter: query }).$promise
      },
      gene_categories: function(query) {
        return Genes.gene_categories({ filter: query }).$promise
      },
      gene_pathways: function(query) {
        return Genes.gene_pathways({ filter: query }).$promise
      },
      protein_functions: function(query) {
        return Genes.protein_functions({ filter: query }).$promise
      }
    };

    $scope.submitEdits = function() {
      $scope.geneEdit.$update({
          description: $scope.geneEdit.description,
          clinical_description: $scope.geneEdit.clinical_description,
          "gene_category[]": $scope.geneEdit.details.gene_category.map(function(item) { return item.text; }),
          "protein_motif[]": $scope.geneEdit.details.protein_motif.map(function(item) { return item.text; }),
          "gene_pathway[]": $scope.geneEdit.details.gene_pathway.map(function(item) { return item.text; }),
          "protein_function[]": $scope.geneEdit.details.protein_functions.map(function(item) { return item.text; })
        },
        function(data) {
          $log.info("update successful.");
          $scope.$parent.gene = Genes.get({'geneId': $stateParams.geneId });
        },
        function(error) {
          $log.info("update unsuccessful.");
        });
    }

  }
})();