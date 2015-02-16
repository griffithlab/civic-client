(function() {
  'use strict';
  angular.module('civic.services')
    .factory('Genes', GenesService);

  // @ngInject
  function GenesService($resource, $cacheFactory, _, $log) {
    var cache = $cacheFactory('genesCache');

    var cacheInterceptor =function(response) {
      cache.remove(response.config.url);
      return response;
    };

    var Genes = $resource('/api/genes/:geneId',
      {
        geneId: '@entrez_id'
      },
      {
        query: { // get a list of all genes
          method: 'GET',
          isArray: true,
          cache: cache
        },
        get: { // get a single gene
          method: 'GET',
          isArray: false,
          cache: cache
        },
        update: {
          method: 'PUT',
          interceptor: {
            response: cacheInterceptor
          }
        }
      });

    return Genes;
  }

})();
