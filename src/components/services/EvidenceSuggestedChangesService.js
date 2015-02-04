(function() {
  'use strict';
  angular.module('civic.services')
    .factory('EvidenceSuggestedChanges', EvidenceSuggestedChangesService);

  // @ngInject
  function EvidenceSuggestedChangesService($resource, $cacheFactory, _, $log) {
    var cache = $cacheFactory('evidenceSuggestedChangesCache');

    var cacheInterceptor = { // custom $resource actions require manually managing cache
      response: function(response) {
        cache.remove(response.config.url);
        return response;
      }
    };

    var evidenceCache = $cacheFactory.get('evidenceCache');

    // TODO: this cache interceptor cannot re-assemble the full request from response.data as it does not contain the geneId or variantId, perhaps a curried function would work?
    var acceptCacheInterceptor = { // deletes cache for updated evidence after 'accept'
      response: function(response) {
        evidenceCache.remove('/api/genes/' + response.data.id);
        return response;
      }
    };

    var EvidenceSuggestedChanges = $resource(
      '/api/genes/:geneId/variants/:variantId/evidence_items/:evidenceItemId/suggested_changes/:suggestedChangeId',
      {
        geneId: '@geneId',
        variantId: '@variantId',
        evidenceItemId: '@evidenceItemId',
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
          url: '/api/genes/:geneId/variants/:variantId/evidence_items/:evidenceItemId/suggested_changes/:suggestedChangeId/accept',
          params: {
            variantId: '@variantId',
            suggestedChangeId: '@suggestedChangeId'
          },
          method: 'POST',
          interceptor: acceptCacheInterceptor
        }
      });

    return EvidenceSuggestedChanges;
  }

})();
