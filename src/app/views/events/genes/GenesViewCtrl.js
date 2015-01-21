(function() {
  'use strict';
  angular.module('civic.events')
    .controller('GenesViewCtrl', GenesViewCtrl);

  // @ngInject
  function GenesViewCtrl(gene, geneDetails, Genes) {
    this.gene = gene;
    this.geneDetails = geneDetails;
    this.variantGroupsExist = _.has(gene, 'variant_groups') && gene.variant_groups.length > 0;
    this.refreshGene = function() {
      this.gene = Genes.get({ geneId: $stateParams.geneId });
    }
  }
})();
