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
        },
        getSuggestions: {
          method: 'GET',
          url: '/api/users/suggestions',
          //params: {
          //  username: '@username'
          //},
          isArray: true,
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
    var suggestions = []

    return {
      data: {
        item: item,
        collection: collection,
        events: events,
        suggestions: suggestions
      },
      get: get,
      query: query,
      queryEvents: queryEvents,
      update: update,
      getSuggestions: getSuggestions
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
    function getSuggestions(str) {
      return UsersResource.getSuggestions({username: str}).$promise
        .then(function(response) {
          angular.copy(response, suggestions);
          return response.$promise;
        });
    }
  }
})();
