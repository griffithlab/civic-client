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
        }
      }
    );
  }

  // @ngInject
  function UsersService(UsersResource) {
    var item = { };

    return {
      data: {
        item: item
      },
      get: get
    };

    function get(userId) {
      return UsersResource.get({userId: userId}).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }
  }
})();
