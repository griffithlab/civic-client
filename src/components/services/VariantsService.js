(function() {
  'use strict';
  angular.module('civic.services')
    .factory('Variants', VariantsService);

  // @ngInject
  function VariantsService($resource, $cacheFactory) {
    var cache = $cacheFactory('variantsCache');

    var cacheInterceptor = {
      response: function(response) {
        cache.remove(response.config.url);
        return response;
      }
    };

    var Variants = $resource('/api/genes/:geneId/variants/:variantId',
      {
        geneId: '@geneID',
        variantId: '@variantId'
      },
      {
        get: {
          method: 'GET',
          isArray: false,
          cache: true
        },
        query: {
          method: 'GET',
          isArray: true,
          cache: true
        },
        update: {
          method: 'PUT',
          interceptor: cacheInterceptor
        }
      });

    return Variants;
  }

})();
