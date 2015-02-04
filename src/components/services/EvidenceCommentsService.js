(function() {
  'use strict';
  angular.module('civic.services')
    .factory('EvidenceComments', EvidenceCommentsService);

  // @ngInject
  function EvidenceCommentsService($resource, $cacheFactory) {
    var cache = $cacheFactory('evidenceCommentsCache');

    var cacheInterceptor = {
      response: function(response) {
        cache.remove(response.config.url);
        return response;
      }
    };

    var EvidenceComments = $resource('/api/genes/:geneId/variants/:variantId/evidence_items/:evidenceItemId/comments/:commentId',
      { geneId: '@geneId',
        variantId: '@variantId',
        evidenceItemId: '@evidenceItemId',
        commentId: '@id'
      },
      {
        query: { // get a list of all evidence_item comments
          method: 'GET',
          isArray: true,
          cache: cache
        },
        get: { // get a single comment
          method: 'GET',
          isArray: false,
          cache: cache
        },
        add: { // add a comment
          method: 'POST',
          interceptor: cacheInterceptor
        }
      });

    return EvidenceComments;
  }

})();
