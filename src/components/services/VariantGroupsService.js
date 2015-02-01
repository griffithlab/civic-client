(function() {
  'use strict';
  angular.module('civic.services')
    .factory('VariantGroups', VariantGroupsService);

  // @ngInject
  function VariantGroupsService($resource) {
    var cacheInterceptor = {
      response: function(response) {
        cache.remove(response.config.url);
        return response;
      }
    };

    var VariantGroups= $resource('/api/variant_groups/:variantGroupId',
      { variantGroupId: 'id' },
      {
        query: {
          method: 'GET',
          isArray: true,
          cache: true
        },
        get: {
          method: 'GET',
          isArray: false,
          cache: true
        },
        update: {
          method: 'PUT',
          interceptor: cacheInterceptor
        }
      });

    return VariantGroups;
  }

})();
