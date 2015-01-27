(function() {
  'use strict';
  angular.module('civic.events')
    .controller('GenesViewCtrl', GenesViewCtrl);

  // @ngInject
  function GenesViewCtrl($scope, gene, geneDetails, Genes) {
    $scope.gene = gene;
    $scope.geneDetails = geneDetails;
    $scope.variantGroupsExist = _.has(gene, 'variant_groups') && gene.variant_groups.length > 0;
    $scope.refreshGene = function() {
      $scope.gene = Genes.get({ geneId: $stateParams.geneId });
    }
  }
})();
