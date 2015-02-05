(function() {
  'use strict';
  angular.module('civic.services')
    .factory('EvidenceSuggestedChangesComments', EvidenceSuggestedChangesCommentsService);

  // @ngInject
  function EvidenceSuggestedChangesCommentsService($resource, $cacheFactory) {
    var cache = $cacheFactory('evidenceSuggestedChangesCommentsCache');

    var cacheInterceptor = {
      response: function(response) {
        cache.remove(response.config.url);
        return response;
      }
    };

    var EvidenceSuggestedChangesComments = $resource(
      '/api/genes/:geneId/variants/:variantId/evidence_items/:evidenceItemId/suggested_changes/:suggestedChangeId/comments/:commentId',
      { geneId: '@geneId',
        variantId: '@variantId',
        evidenceItemId: '@evidenceItemId',
        suggestedChangeId: '@suggestedChangeId',
        commentId: '@id'
      },
      {
        query: { // get a list of all suggested change comments
          method: 'GET',
          isArray: true,
          cache: cache
        },
        get: { // get a single suggested change comment
          method: 'GET',
          isArray: false,
          cache: cache
        },
        add: {
          method: 'POST',
          interceptor: cacheInterceptor
        }
      });

    return EvidenceSuggestedChangesComments;
  }

})();
