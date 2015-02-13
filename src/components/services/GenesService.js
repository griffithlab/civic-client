(function() {
  'use strict';
  angular.module('civic.services')
    .factory('Genes', GenesService);

  // @ngInject
  function GenesService($resource, $cacheFactory, _, $log) {
    var cache = $cacheFactory('genesCache');

    var cacheInterceptor = function(response) {
      $log.info('GeneService cache interceptor called.');
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
          params: {
            geneId: '@entrez_id'
          },
          interceptor: {
            response: cacheInterceptor,
            responseError: function(response) {
              $log.error('GeneService response error.');
              $log.info(JSON.stringify(response));
            }
          }
        }
      });

    return Genes;
  }

})();
