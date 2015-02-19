(function() {
  'use strict';
  angular.module('civic.services')
    .factory('GenesSuggestedChanges', GenesSuggestedChangesService);

  // @ngInject
  function GenesSuggestedChangesService($resource, $cacheFactory, _, $log) {
    var cache = $cacheFactory('genesSuggestedChangesCache');

    var cacheInterceptor = { // custom $resource actions require manually managing cache
      response: function(response) {
        cache.remove(response.config.url);
        return response;
      }
    };

    var genesCache = $cacheFactory.get('genesCache');

    var acceptCacheInterceptor = {
      response: function(response) {
        // remove cache for updated gene
        genesCache.remove('/api/genes/' + response.data.entrez_id);
        // also remove cache for the change request
        cache.remove(response.config.url);
        return response;
      }
    };

    var GenesSuggestedChanges = $resource('/api/genes/:geneId/suggested_changes/:suggestedChangeId',
      {
        geneId: '@entrez_id'
      },
      {
        query: { // get a list of all suggested changes
          method: 'GET',
          isArray: true,
          cache: cache
        },
        get: { // get a single suggested change
          method: 'GET',
          isArray: false,
          cache: cache
        },
        add: { // add a suggested change
          method: 'POST',
          interceptor: cacheInterceptor
        },
        accept: { // accept a change
          method: 'POST',
          url: '/api/genes/:geneId/suggested_changes/:suggestedChangeId/accept',
          params: {
            geneId: '@entrez_id',
            suggestedChangeId: '@suggestedChangeId'
          },
          interceptor: acceptCacheInterceptor
        },
        reject: { // reject a change
          method: 'POST',
          url: '/api/genes/:geneId/suggested_changes/:suggestedChangeId/reject',
          interceptor: cacheInterceptor
        }
      });

    return GenesSuggestedChanges;
  }

})();
