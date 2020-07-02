(function() {
  'use strict';
  angular.module('civic.services')
    .factory('ReleasesResource', ReleasesResource)
    .factory('Releases', ReleasesService);

  // @ngInject
  function ReleasesResource($resource, $cacheFactory) {
    var cache = $cacheFactory.get('$http');

    return $resource('/api/releases?count=999', // fetch all releases
      {}, {
      query: {
        method: 'GET',
        isArray: true,
        cache: false
      }
    });
  }

  // @ngInject
  function ReleasesService(ReleasesResource, $q) {
    //var cache = $cacheFactory.get('$http');

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
      ]);
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
