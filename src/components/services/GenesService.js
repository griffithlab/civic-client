(function() {
  'use strict';
  angular.module('civic.services')
    .factory('GenesResource', GenesResource)
    .factory('Genes', GenesService);

  // @ngInject
  function GenesResource($resource, $cacheFactory, _, $log) {
    var cache = $cacheFactory('genesCache');

    var cacheInterceptor =function(response) {
      cache.remove(response.config.url);
      return response;
    };

    return $resource('/api/genes/:geneId',
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
          cache: cache,
          transformRequest: function(request) {
            console.log('GenesService.get transformRequest called.');
            return request;
          }
        },
        update: {
          method: 'PUT',
          interceptor: {
            response: cacheInterceptor
          }
        }
      });
  }

  //ngInject
  function GenesService(GenesResource) {
    return {
      get: function(entrez_id) {
        return GenesResource.get({geneId: entrez_id}).$promise;
      },
      query: function() {
        return GenesResource.query().$promise;
      }
    }
  }

})();
