(function() {
  'use strict';
  angular.module('civic.services')
    .factory('VariantsSuggestedChanges', VariantsSuggestedChangesService);

  // @ngInject
  function VariantsSuggestedChangesService($resource, $cacheFactory, _, $log) {
    var cache = $cacheFactory('variantsSuggestedChangesCache');

    var cacheInterceptor = { // custom $resource actions require manually managing cache
      response: function(response) {
        cache.remove(response.config.url);
        return response;
      }
    };

    var variantsCache = $cacheFactory.get('variantsCache');

    var acceptCacheInterceptor = { // deletes cache for updated variants after 'accept'
      response: function(response) {
        variantsCache.remove('/api/genes/' + response.data.id);
        return response;
      }
    };

    var VariantsSuggestedChanges = $resource('/api/genes/:geneId/variants/:variantId/suggested_changes/:suggestedChangeId',
      {
        geneId: '@geneId',
        variantId: '@variantId',
        suggestedChangeId: '@suggestedChangeId'
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
          url: '/api/genes/:geneId/variants/:variantId/suggested_changes/:suggestedChangeId/accept',
          params: {
            variantId: '@variantId',
            suggestedChangeId: '@suggestedChangeId'
          },
          method: 'POST',
          interceptor: acceptCacheInterceptor
        }
      });

    return VariantsSuggestedChanges;
  }

})();
