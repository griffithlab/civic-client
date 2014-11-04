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
        }
      });

    return Genes;
  }

})();