(function() {
  'use strict';
  angular.module('civic.services')
    .factory('UsersResource', UsersResource)
    .factory('Users', UsersService);

  // @ngInject
  function UsersResource($resource, UserOrgsInterceptor) {
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
          cache: false,
          interceptor: {
            response: UserOrgsInterceptor
          }
        },
        query: {
          method: 'GET',
          isArray: false,
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
  function UsersService($q, UsersResource, UserOrgsInterceptor) {
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
      query: query,
      queryEvents: queryEvents,
      update: update
    };

    function get(userId) {
      return UsersResource.get({userId: userId}).$promise
        .then(function(response) {
          angular.copy(response, item);
          return $q.when(response); // kludge to handle UserOrgsInterceptor returning $promise-less response
        });
    }
    function query(reqObj) {
      return UsersResource.query(reqObj).$promise
        .then(function(response) {
          response.result = response.result.map(function(u) {
            var mock = {};
            mock.data = u;
            return UserOrgsInterceptor(mock);
          });
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
