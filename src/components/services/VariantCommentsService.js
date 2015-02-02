(function() {
  'use strict';
  angular.module('civic.services')
    .factory('VariantComments', VariantCommentsService);

  // @ngInject
  function VariantCommentsService($resource, $cacheFactory) {
    var cache = $cacheFactory('variantCommentsCache');

    var cacheInterceptor = {
      response: function(response) {
        cache.remove(response.config.url);
        return response;
      }
    };

    var Genes = $resource('/api/genes/:geneId/variants/:variantId/comments/:commentId',
      { geneId: '@geneId',
        variantId: '@variantId',
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

    return Genes;
  }

})();
