(function() {
  'use strict';
  angular.module('civic.services')
    .factory('Genes', GenesService);

  // @ngInject
  function GenesService($resource) {
    var Genes = $resource('/api/genes/:geneId',
      { geneId: '@entrez_name' },
      {
        query: { // query details for a single gene
          method: 'GET',
          isArray: true
        },
        get: { // get a list of all genes
          method: 'GET',
          isArray: false
        },
        update: {
          method: 'PUT'
        },
        protein_motifs: {
          method: 'GET',
          url: '/api/genes/protein_motifs',
          isArray: true
        },
        gene_categories: {
          method: 'GET',
          url: '/api/genes/categories',
          isArray: true
        },
        gene_pathways: {
          method: 'GET',
          url: '/api/genes/pathways',
          isArray: true
        },
        protein_functions: {
          method: 'GET',
          url: '/api/genes/protein_functions',
          isArray: true
        }

      });

    return Genes;
  }

})();