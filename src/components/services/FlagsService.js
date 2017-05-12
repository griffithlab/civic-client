(function() {
  'use strict';
  angular.module('civic.services')
    .factory('FlagsResource', FlagsResource)
    .factory('Flags', FlagsService);

  // @ngInject
  function FlagsResource($resource, $cacheFactory) {
    var cache = $cacheFactory.get('$http');

    var cacheInterceptor = function(response) {
      // console.log(['GenesResource: removing', response.config.url, 'from $http cache.'].join(' '));
      cache.remove(response.config.url);
      return response.$promise;
    };

    return $resource(
      '/api/curation/open_flags',
      {},
      {
        queryOpen: {
          method: 'GET',
          isArray: false,
          cache: true
        }
      });
  }

  // @ngInject
  function FlagsService($cacheFactory, FlagsResource) {
    var cache = $cacheFactory.get('$http');


    var collection = [];

    return {
      data: {
        collection: collection
      },
      queryOpen: queryOpen
    };

    function queryOpen() {
      return FlagsResource.queryOpen().$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }
  }
})();
