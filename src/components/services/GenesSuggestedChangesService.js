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

    var acceptCacheInterceptor = { // deletes cache for updated gene after 'accept'
      response: function(response) {
        genesCache.remove('/api/genes/' + response.data.entrez_id);
        return response;
      }
    };

    var Genes = $resource('/api/genes/:geneId/suggested_changes/:suggestedChangeId',
      { geneId: '@entrez_id',
        suggestedChangeId: '@id'
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
        accept: { // accept & commit a change
          url: '/api/genes/:geneId/suggested_changes/:suggestedChangeId/accept',
          params: {
            geneId: '@geneId',
            suggestedChangeId: '@suggestedChangeId'
          },
          method: 'POST',
          interceptor: acceptCacheInterceptor
        }
      });

    return Genes;
  }

})();
