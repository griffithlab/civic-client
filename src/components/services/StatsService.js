(function() {
  'use strict';
  angular.module('civic.services')
    .factory('StatsResource', StatsResource)
    .factory('Stats', StatsService);

  // @ngInject
  function StatsResource($resource) {

    return $resource('',
      { },
      {
        site: {
          url: '/api/stats/site',
          method: 'GET',
          isArray: false,
          cache: false
        },
        user: {
          url: '/api/users/:userId/stats',
          params: {
            userId: '@userId'
          },
          method: 'GET',
          isArray: false,
          cache: false
        },
        dashboard: {
          url: '/api/stats/dashboard',
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
      site: site,
      user: user,
      dashboard: dashboard
    };

    function site() {
      return StatsResource.site().$promise
        .then(function(response) {
          return response.$promise;
        });
    }

    function user(userId) {
      return StatsResource.user({ userId: userId}).$promise
        .then(function(response) {
          return response.$promise;
        });
    }
    function dashboard() {
      return StatsResource.dashboard().$promise
        .then(function(response) {
          return response.$promise;
        });
    }
  }
})();
