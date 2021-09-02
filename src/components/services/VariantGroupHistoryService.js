(function() {
  'use strict';
  angular.module('civic.services')
    .factory('VariantGroupHistoryResource', VariantGroupHistoryResource)
    .factory('VariantGroupHistory', VariantGroupHistoryService);

  function VariantGroupHistoryResource($resource, $cacheFactory) {
    var cache = $cacheFactory.get('$http');

    // adding this interceptor to a route will remove cached record
    //var cacheInterceptor = function(response) {
    //  cache.remove(response.config.url);
    //  return response.$promise;
    //};
    return $resource('/api/variant_groups/:variantId/revisions',
      {
        variantId: '@variantId'
      },
      {
        // Base Variant History Resources
        query: {
          method: 'GET',
          isArray: true,
          cache: cache
        },
        last: {
          method: 'GET',
          isArray: false,
          cache: cache
        },

        // Base Variant History Refresh
        queryFresh: {
          method: 'GET',
          isArray: true,
          cache: false
        },
        lastFresh: {
          method: 'GET',
          isArray: false,
          cache: false
        }
      }
    );
  }

  function VariantGroupHistoryService(VariantGroupHistoryResource, $q) {
    // Variant History Base
    var item = {};
    var collection = [];

    return {
      initBase: initBase,
      data: {
        item: item,
        collection: collection,
      },

      // Variant History Base
      query: query,
      last: last,

      // Variant History Base Refresh
      queryFresh: queryFresh,
      lastFresh: lastFresh
    };

    function initBase(variantId) {
      return $q.all([
        query(variantId)
      ]);
    }

    // Variant History Base
    function query(variantId) {
      return VariantGroupHistoryResource.query({ variantId: variantId }).$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }
    function last(variantId) {
      return VariantGroupHistoryResource.last({ variantId: variantId }).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }

    // Variant History Base Refresh
    function queryFresh(variantId) {
      return VariantGroupHistoryResource.queryFresh({ variantId: variantId }).$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }
    function lastFresh(variantId) {
      return VariantGroupHistoryResource.lastFresh({ variantId: variantId }).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }
  }
})();
