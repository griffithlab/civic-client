(function() {
  'use strict';
  angular.module('civic.services')
    .factory('VariantGroupsComments', VariantGroupsCommentsService);

  // @ngInject
  function VariantGroupsCommentsService($resource, $cacheFactory) {
    var cache = $cacheFactory('variantGroupsCommentsCache');

    var cacheInterceptor = {
      response: function(response) {
        cache.remove(response.config.url);
        return response;
      }
    };

    var VariantGroups = $resource('/api/variant_groups/:variantGroupId/comments/:commentId',
      { variantGroupId: '@variantGroupId',
        commentId: '@id'
      },
      {
        query: { // get a list of all gene comments
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

    return VariantGroups;
  }

})();
