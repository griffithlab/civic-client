(function() {
  angular.module('civic.services')
    .factory('ReleasesResource', ReleasesResource)
    .factory('Releases', ReleasesService);

  // @ngInject
  function ReleasesResource($resource, $cacheFactory) {
    var cache = $cacheFactory.get('$http');

    var cacheInterceptor = function(response) {
      console.log(['ReleasesResource: removing', response.config.url, 'from $http cache.'].join(" "));
      cache.remove(response.config.url);
      return response.$promise;
    };

    return $resource('/api/releases',
      {
        // Base Release Resources
        query: {
          method: 'GET',
          isArray: true,
          cache: cache
        }
      }
    )
  }

  // @ngInject
  function ReleasesService(ReleasesResource, $q, $cacheFactory) {
    var cache = $cacheFactory.get('$http');

    var collection = [];

    return {
      initBase: initBase,
      data: {
        collection: collection
      },

      // Release Base
      query: query
    };

    function initBase() {
      return $q.all([
        query()
      ])
    }

    // Release Base
    function query() {
      return ReleasesResource.query().$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }
  }
})();
