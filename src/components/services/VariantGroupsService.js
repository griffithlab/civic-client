(function() {
  'use strict';
  angular.module('civic.services')
    .factory('VariantGroupsResource', VariantGroupsResource)
    .factory('VariantGroups', VariantGroupsService);

  // @ngInject
  function VariantGroupsResource($resource, $cacheFactory) {
    var cache = $cacheFactory('variantGroupsCache');

    var cacheInterceptor= function(response) {
      cache.remove(response.config.url);
      return response;
    };

    var VariantGroups= $resource('/api/variant_groups/:variantGroupId',
      { variantGroupId: '@variantGroupId' },
      {
        add: {
          method: 'POST',
          cache: cache
        },
        query: { // get a list of all variants
          method: 'GET',
          isArray: true,
          cache: true
        },
        get: { // get a single variant group
          method: 'GET',
          isArray: false,
          cache: true
        },
        delete: {
          method: 'DELETE',
          cache: cache
        },
        update: {
          method: 'PATCH',
          interceptor: {
            response: cacheInterceptor
          }
        },
        refresh: { // get variant, force cache refresh
          method: 'GET',
          isArray: false,
          cache: false
        },
      });

    return VariantGroups;
  }

  // @ngInject
  function VariantGroupsService(VariantGroupsResource) {
    return {
      add: function(reqObj) {
        return VariantGroupsResource.add(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      delete: function(variantGroupId) {
        return VariantGroupsResource.delete({variantGroupId: variantGroupId}).$promise
          .then(function(response) {
            return response;
          });
      },
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
      },
      refresh: function(variantGroupId) {
        return VariantGroupsResource.refresh({variantGroupId: variantGroupId}).$promise
          .then(function(response) {
            return response;
          });
      },
    }
  }

})();
