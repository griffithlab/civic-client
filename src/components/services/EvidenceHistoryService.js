(function() {
  angular.module('civic.services')
    .factory('EvidenceHistoryResource', EvidenceHistoryResource)
    .factory('EvidenceHistory', EvidenceHistoryService);

  function EvidenceHistoryResource($resource, $cacheFactory) {
    var cache = $cacheFactory.get('$http');

    // adding this interceptor to a route will remove cached record
    var cacheInterceptor = function(response) {
      cache.remove(response.config.url);
      return response.$promise;
    };
    return $resource('/api/evidence_items/:evidenceId/revisions',
      {
        evidenceId: '@evidenceId'
      },
      {
        // Base Evidence Revisions Resources
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

        // Base Evidence History Refresh
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
    )
  }

  function EvidenceHistoryService(EvidenceHistoryResource, $q) {
    // Evidence History Base
    var item = {};
    var collection = [];

    return {
      initBase: initBase,
      data: {
        item: item,
        collection: collection
      },

      // Evidence History Base
      query: query,
      last: last,

      // Evidence History Base Refresh
      queryFresh: queryFresh,
      lastFresh: lastFresh
    };

    function initBase(evidenceId) {
      return $q.all([
        query(evidenceId)
      ])
    }

    // Evidence History Base
    function query(evidenceId) {
      return EvidenceHistoryResource.query({ evidenceId: evidenceId }).$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }
    function last(evidenceId) {
      return EvidenceHistoryResource.last({ evidenceId: evidenceId }).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        })
    }

    // Evidence History Base Refresh
    function queryFresh(evidenceId) {
      return EvidenceHistoryResource.queryFresh({ evidenceId: evidenceId }).$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }
    function lastFresh(evidenceId) {
      return EvidenceHistoryResource.lastFresh({ evidenceId: evidenceId }).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        })
    }
  }
})();
