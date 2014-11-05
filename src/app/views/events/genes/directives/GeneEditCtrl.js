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

//    $scope.tags = {
//      protein_motifs: Genes.protein_motifs(),
//      gene_categories: Genes.gene_categories(),
//      gene_pathways: Genes.gene_pathways(),
//      protein_functions: Genes.protein_functions()
//    };

    $scope.submitEdits = function() {
      $scope.geneEdit.$update({
          description: $scope.geneEdit.description,
          clinical_description: $scope.geneEdit.clinical_description,
          details: {
            gene_category: $scope.geneEdit.details.gene_category.map(function(item) { return item.text; })
          }
        },
        function(data) {
          $log.info("update successful.");
          $scope.$parent.gene = data;
        },
        function(error) {
          $log.info("update unsuccessful.");
        });
    }

  }
})();