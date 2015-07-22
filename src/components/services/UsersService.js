(function() {
  'use strict';
  angular.module('civic.services')
    .factory('UsersResource', UsersResource)
    .factory('Users', UsersService);

  // @ngInject
  function UsersResource($resource) {

    return $resource('/api/users/:userId',
      {
        userId: '@userId'
      },
      {
        get: {
          method: 'GET',
          isArray: false,
          cache: false
        },
        queryEvents: {
          url: '/api/users/:userId/events',
          method: 'GET',
          isArray: true,
          cache: false
        }
      }
    );
  }

  // @ngInject
  function UsersService(UsersResource) {
    var item = { };
    var events = [];

    return {
      data: {
        item: item,
        events: events
      },
      get: get,
      queryEvents: queryEvents
    };

    function get(userId) {
      return UsersResource.get({userId: userId}).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }
    function queryEvents(userId) {
      return UsersResource.queryEvents({userId: userId}).$promise
        .then(function(response) {
          angular.copy(response, events);
          return response.$promise;
        });
    }
  }
})();
