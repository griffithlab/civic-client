(function() {
  'use strict';
  angular.module('civic.services')
    .factory('VariantsSuggestedChangesComments', VariantsSuggestedChangesCommentsService);

  // @ngInject
  function VariantsSuggestedChangesCommentsService($resource, $cacheFactory) {
    var cache = $cacheFactory('variantsSuggestedChangesCommentsCache');

    var cacheInterceptor = {
      response: function(response) {
        cache.remove(response.config.url);
        return response;
      }
    };

    var Variants = $resource('/api/genes/:geneId/variants/:variantId/suggested_changes/:suggestedChangeId/comments/:commentId',
      { geneId: '@geneId',
        variantId: '@variantId',
        suggestedChangeId: '@suggestedChangeId',
        commentId: '@id'
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
        add: {
          method: 'POST',
          interceptor: cacheInterceptor
        }
      });

    return Variants;
  }

})();
