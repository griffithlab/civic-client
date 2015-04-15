(function() {
  'use strict';
  angular.module('civic.services')
    .factory('VariantGroupsResource', VariantGroupsResource)
    .factory('VariantGroups', VariantGroupsService);

  // @ngInject
  function VariantGroupsResource($resource) {
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

  // @ngInject
  function VariantGroupsService(VariantGroupsResource) {
    return {
      get: function (variantGroupId) {
        return VariantGroupsResource.get({variantGroupId: variantGroupId}).$promise
          .then(function (response) {
            return response;
          });
      },
      query: function () {
        return VariantGroupsResource.query().$promise
          .then(function (response) {
            return response;
          });
      },
      update: function (reqObj) {
        return VariantGroupsResource.update(reqObj).$promise
          .then(function (response) {
            return response;
          });
      }
    }
  }

})();
