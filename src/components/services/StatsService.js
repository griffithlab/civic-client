(function() {
  'use strict';
  angular.module('civic.services')
    .factory('StatsResource', StatsResource)
    .factory('Stats', StatsService);

  // @ngInject
  function StatsResource($resource) {

    return $resource('/api/stats/:entityName',
      {
        entityName: '@entityName'
      },
      {
        get: {
          method: 'GET',
          isArray: false,
          cache: false
        }
      }
    );
  }

  // @ngInject
  function StatsService(StatsResource) {
    var item = { };

    return {
      data: {
        item: item
      },
      get: get
    };

    function get(entityName) {
      return StatsResource.get({entityName: entityName}).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }
  }
})();
