(function() {
  'use strict';
  angular.module('civic.services')
    .factory('AssertionHistoryResource', AssertionHistoryResource)
    .factory('AssertionHistory', AssertionHistoryService);

  function AssertionHistoryResource($resource, $cacheFactory) {
    var cache = $cacheFactory.get('$http');

    // adding this interceptor to a route will remove cached record
    //var cacheInterceptor = function(response) {
    //  cache.remove(response.config.url);
    //  return response.$promise;
    //};
    return $resource('/api/assertions/:assertionId/revisions',
      {
        assertionId: '@assertionId'
      },
      {
        // Base Assertion Revisions Resources
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

        // Base Assertion History Refresh
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

  function AssertionHistoryService(AssertionHistoryResource, $q) {
    // Assertion History Base
    var item = {};
    var collection = [];

    return {
      initBase: initBase,
      data: {
        item: item,
        collection: collection,
      },

      // Assertion History Base
      query: query,
      last: last,

      // Assertion History Base Refresh
      queryFresh: queryFresh,
      lastFresh: lastFresh
    };

    function initBase(assertionId) {
      return $q.all([
        query(assertionId)
      ]);
    }

    // Assertion History Base
    function query(assertionId) {
      return AssertionHistoryResource.query({ assertionId: assertionId }).$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }
    function last(assertionId) {
      return AssertionHistoryResource.last({ assertionId: assertionId }).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }

    // Assertion History Base Refresh
    function queryFresh(assertionId) {
      return AssertionHistoryResource.queryFresh({ assertionId: assertionId }).$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }
    function lastFresh(assertionId) {
      return AssertionHistoryResource.lastFresh({ assertionId: assertionId }).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }
  }
})();
