(function() {
  'use strict';
  angular.module('civic.services')
    .factory('Genes', GenesService);

  // @ngInject
  function GenesService($resource, _) {

    function transformTags (tags) {
      return _.map(tags, function(tag) {
        return { text: tag.name }
      })
    }

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
          transformResponse: function (data) {
            return transformTags(JSON.parse(data));
          },
          isArray: true
        },
        gene_categories: {
          method: 'GET',
          url: '/api/genes/categories',
          transformResponse: function (data) {
            return transformTags(JSON.parse(data));
          },
          isArray: true
        },
        gene_pathways: {
          method: 'GET',
          url: '/api/genes/pathways',
          transformResponse: function (data) {
            return transformTags(JSON.parse(data));
          },
          isArray: true
        },
        protein_functions: {
          method: 'GET',
          url: '/api/genes/protein_functions',
          transformResponse: function (data) {
            return transformTags(JSON.parse(data));
          },
          isArray: true
        }

      });

    return Genes;
  }

})();