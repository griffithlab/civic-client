(function() {
  'use strict';
  angular.module('civic.services')
    .factory('SearchResource',SearchResource)
    .factory('Search', SearchService);

  // @ngInject
  function SearchResource($resource, $q) {
    var SearchService = $resource('/api/:entity/search/:token',
      {
        token: '@token',
        entity: '@entity'
      },
      {
        post: {
          method: 'POST',
          isArray: false,
          cache: false,
          cancellable: true,
          interceptor: {
            response: function(response) {
              if (response.resource.results.length > 0) {
                return $q.resolve(response.resource);
              }
              return $q.reject('No results returned. Please try narrowing your search parameters.');
            }
          }
        }
      },
      {
        get: {
          method: 'GET',
          isArray: false,
          cache: false
        }
      }
    );

    return SearchService;
  }

  // @ngInject
  function SearchService(SearchResource) {
    var results = {};

    return {
      results: results,
      post: post,
      get: get,
      reset: reset
    };

    function reset() {
      results = {};
    }

    // @ngInject
    function post(reqObj) {
      return SearchResource.post(reqObj).$promise
        .then(function(response) {
          angular.copy(response, results);
          return response.$promise;
        });
    }

    // @ngInject
    function get(reqObj) {
      return SearchResource.get(reqObj).$promise
        .then(function(response) {
          angular.copy(response, results);
          return response.$promise;
        });
    }

  }

})();
