(function() {
  'use strict';
  angular.module('civic.services')
    .factory('SearchResource',SearchResource)
    .factory('Search', SearchService);

  // @ngInject
  function SearchResource($resource) {
    var SearchService = $resource('/api/evidence_items/search',
      {},
      {
        post: {
          method: 'POST',
          isArray: true,
          cache: false
        }
      });

    return SearchService;
  }

  // @ngInject
  function SearchService(SearchResource) {
    var results = [];

    return {
      results: results,
      post: post
    };

    // @ngInject
    function post(reqObj) {
      return SearchResource.post(reqObj).$promise
        .then(function(response) {
          angular.copy(response, results);
          return response.$promise;
        });
    }

  }

})();
