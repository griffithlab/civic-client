(function() {
  'use strict';
  angular.module('civic.services')
    .factory('VariantGroupsSuggestedChanges', VariantGroupsSuggestedChanges);

  // @ngInject
  function VariantGroupsSuggestedChanges($resource, $cacheFactory) {
    var cache = $cacheFactory('variantGroupsSuggestedChangesCache');

    var cacheInterceptor = { // custom $resource actions require manually managing cache
      response: function(response) {
        cache.remove(response.config.url);
        return response;
      }
    };

    var variantGroupsCache = $cacheFactory.get('variantGroupsCache');

    var acceptCacheInterceptor = { // deletes cache for updated gene after 'accept'
      response: function(response) {
        variantGroupsCache.remove('/api/variant_groups/' + response.data.id);
        return response;
      }
    };

    var VariantGroups = $resource('/api/variant_groups/:variantGroupId/suggested_changes/:suggestedChangeId',
      { geneId: '@variantGroupId',
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
          url: '/api/variant_groups/:variantGroupId/suggested_changes/:suggestedChangeId/accept',
          params: {
            geneId: '@variantGroupId',
            suggestedChangeId: '@suggestedChangeId'
          },
          method: 'POST',
          interceptor: acceptCacheInterceptor
        }
      });

    return VariantGroups;
  }

})();
