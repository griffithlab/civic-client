(function() {
  'use strict';
  angular.module('civic.services')
    .factory('GeneHistoryResource', GeneHistoryResource)
    .factory('GeneHistory', GeneHistoryService);

  function GeneHistoryResource($resource, $cacheFactory) {
    var cache = $cacheFactory.get('$http');

    // adding this interceptor to a route will remove cached record
    //var cacheInterceptor = function(response) {
    //  cache.remove(response.config.url);
    //  return response.$promise;
    //};
    return $resource('/api/genes/:geneId/revisions',
      {
        geneId: '@geneId'
      },
      {
        // Base Gene Revisions Resources
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

        // Base Gene History Refresh
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

  function GeneHistoryService(GeneHistoryResource, $q) {
    // Gene History Base
    var item = {};
    var collection = [];

    return {
      initBase: initBase,
      data: {
        item: item,
        collection: collection,
      },

      // Gene History Base
      query: query,
      last: last,

      // Gene History Base Refresh
      queryFresh: queryFresh,
      lastFresh: lastFresh
    };

    function initBase(geneId) {
      return $q.all([
        query(geneId)
      ]);
    }

    // Gene History Base
    function query(geneId) {
      return GeneHistoryResource.query({ geneId: geneId }).$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }
    function last(geneId) {
      return GeneHistoryResource.last({ geneId: geneId }).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }

    // Gene History Base Refresh
    function queryFresh(geneId) {
      return GeneHistoryResource.queryFresh({ geneId: geneId }).$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }
    function lastFresh(geneId) {
      return GeneHistoryResource.lastFresh({ geneId: geneId }).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }
  }
})();
