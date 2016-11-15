(function() {
  'use strict';
  angular.module('civic.services')
    .factory('MyVariantInfoResource', MyVariantInfoResource)
    .factory('MyVariantInfo', MyVariantInfoService);

  // @ngInject
  function MyVariantInfoResource($resource, $cacheFactory) {

    var cache = $cacheFactory('MyVariantInfo'); // default cache doesn't work for some reason

    return $resource('/api/genes/myvariant_info_proxy/:variantId',
      {
        variantId: '@variantId'
      },
      {
        get: {
          isArray: false,
          cache: cache
        }

      });
  }

  // @ngInject
  function MyVariantInfoService(MyVariantInfoResource) {
    return {
      get: function(entrez_id) {
        return MyVariantInfoResource.get({variantId: entrez_id}).$promise
          .then(function(response) {
            return response;
        });
      }
    };
  }
})();
