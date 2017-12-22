(function() {
  'use strict';
  angular.module('civic.services')
    .factory('AssertionsResource', AssertionsResource)
    .factory('Assertions', AssertionsService);

  // @ngInject
  function AssertionsResource($resource) {
    //var cache = $cacheFactory.get('$http');

    //var cacheInterceptor = function(response) {
    //  console.log(['EvidenceResource: removing', response.config.url, 'from $http cache.'].join(' '));
    //  cache.remove(response.config.url);
    //  return response.$promise;
    //};


    return $resource('/api/assertions',
      {},
      {
        query: {
          url: '/api/assertions',
          method: 'GET',
          isArray: true,
          cache: false
        },
        get: {
          url: '/api/assertions/:assertionId',
          method: 'GET',
          isArray: false,
          cache: false
        },
        add: {
          method: 'POST',
          cache: false
        }
      }
    );
  }

  // @ngInject
  function AssertionsService(AssertionsResource) {
    var collection = { };
    var item = { };

    return {
      data: {
        item: item,
        collection: collection
      },
      query: query,
      get: get,
      add: add
    };

    function query() {
      return AssertionsResource.query().$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }

    function get(id) {
      return AssertionsResource.get({assertionId: id}).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }

    function add(reqObj) {
      return AssertionsResource.add(reqObj).$promise
        .then(function(response) {
          console.log('Assertion submitted!');
          return response.$promise;
        });
    }
  }
})();
