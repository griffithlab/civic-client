(function() {
  'use strict';
  angular.module('civic.services')
    .factory('UsersResource', UsersResource)
    .factory('Users', UsersService);

  // @ngInject
  function UsersResource($resource) {
    //var cache = $cacheFactory.get('$http');

    //var cacheInterceptor = function(response) {
    //  console.log(['EvidenceResource: removing', response.config.url, 'from $http cache.'].join(' '));
    //  cache.remove(response.config.url);
    //  return response.$promise;
    //};


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
        query: {
          method: 'GET',
          isArray: true,
          cache: false
        },
        update: {
          method: 'PATCH',
          params: {
            userId: '@id'
          },
          cache: false
        },
        queryEvents: {
          url: '/api/users/:userId/events',
          method: 'GET',
          isArray: false,
          cache: false
        }
      }
    );
  }

  // @ngInject
  function UsersService(UsersResource) {
    var item = { };
    var collection = [];
    var events = [];

    return {
      data: {
        item: item,
        collection: collection,
        events: events
      },
      get: get,
      queryEvents: queryEvents,
      update: update
    };

    function get(userId) {
      return UsersResource.get({userId: userId}).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }
    function query(reqObj) {
      return UsersResource.query(reqObj).$promise
        .then(function(response) {
          angular.copy(response, collection);
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
    function update(user) {
      return UsersResource.update(user).$promise
        .then(function(response) {
          return response.$promise;
        });
    }
  }
})();
