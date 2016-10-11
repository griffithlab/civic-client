(function() {
  'use strict';
  angular.module('civic.services')
    .factory('SourcesResource', SourcesResource)
    .factory('Sources', SourcesService);

  // @ngInject
  function SourcesResource($resource) {
    return $resource('/api/sources',
      {},
      {
        query: {
          method: 'GET',
          isArray: true,
          cache: true
        },
        get: {
          method: 'GET',
          url: '/api/sources/:sourceId',
          isArray: false,
          cache: true
        },
        suggest: {
          method: 'POST',
          url: '/api/sources',
          isArray: false,
          cache: false
        },
        setStatus: {
          method: 'PATCH',
          params: {
            suggestionId: '@suggestionId',
            status: '@status'
          },
          url: '/api/source_suggestions/:suggestionId',
          isArray: false,
          cache: false
        },
        querySuggested: {
          method: 'GET',
          url: '/api/datatables/source_suggestions',
          params: {
            count: '@count',
            page: '@page'
          },
          isArray: false,
          cache: false
        }
      }
    );
  }

  // @ngInject
  function SourcesService(SourcesResource) {
    var item = {};
    var collection = [];
    var suggested = [];
    return {
      data: {
        item: item,
        collection: collection,
        suggested: suggested
      },
      query: query,
      get: get,
      suggest: suggest,
      getSuggested: getSuggested,
      setStatus: setStatus
    };

    function query() {
      return SourcesResource.query().$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }

    function get(sourceId) {
      return SourcesResource.get({sourceId: sourceId}).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }

    function suggest(reqObj) {
      return SourcesResource.suggest(reqObj).$promise
        .then(function(response) {
          return response.$promise;
        });
    }

    function getSuggested(reqObj) {
      return SourcesResource.querySuggested(reqObj).$promise
        .then(function(response) {
          angular.copy(response.result, suggested);
          return response.$promise;
        });
    }

    function setStatus(reqObj) {
      return SourcesResource.querySuggested(reqObj).$promise
        .then(function(response) {
          return response.$promise;
        });
    }
  }
})();
