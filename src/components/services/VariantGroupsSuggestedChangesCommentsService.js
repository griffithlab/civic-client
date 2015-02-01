(function() {
  'use strict';
  angular.module('civic.services')
    .factory('VariantGroupsSuggestedChangesComments', VariantGroupsSuggestedChangesCommentsService);

  // @ngInject
  function VariantGroupsSuggestedChangesCommentsService($resource, $cacheFactory, _, $log) {
    var cache = $cacheFactory('variantGroupSuggestedChangesCommentsCache');

    var cacheInterceptor = {
      response: function(response) {
        cache.remove(response.config.url);
        return response;
      }
    };

    var VariantGroups = $resource('/api/variant_groups/:variantGroupId/suggested_changes/:suggestedChangeId/comments/:commentId',
      { variantGroupId: '@id',
        suggestedChangeId: '@suggestedChangeId',
        commentId: '@commentId'
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

    return VariantGroups;
  }

})();
