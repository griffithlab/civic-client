(function() {
  'use strict';
  angular.module('civic.services')
    .factory('CommunityResource', CommunityResource)
    .factory('Community', CommunityService);

  // @ngInject
  function CommunityResource($resource) {

    return $resource('/api/community', {}, {
        organizationLeaderboards: {
          url: '/api/community/leaderboards/organizations',
          method: 'GET',
          isArray: false,
          cache: false
        },
        userLeaderboards: {
          url: '/api/community/leaderboards/users',
          method: 'GET',
          isArray: false,
          cache: false
        }
      }
    );
  }

  // @ngInject
  function CommunityService(CommunityResource) {
    var userLeaderboards = {};
    var organizationLeaderboards = {};

    return {
      data: {
        userLeaderboards: userLeaderboards,
        organizationLeaderboards: organizationLeaderboards
      },
      getUserLeaderboards: getUserLeaderboards,
      getOrganizationLeaderboards: getOrganizationLeaderboards
    };

    function getUserLeaderboards() {
      return CommunityResource.userLeaderboards().$promise
        .then(function(response) {
          angular.copy(response, userLeaderboards);
          return response.$promise;
        });
    }

    function getOrganizationLeaderboards() {
      return CommunityResource.organizationLeaderboards().$promise
        .then(function(response) {
          angular.copy(response, organizationLeaderboards);
          return response.$promise;
        });
    }
  }
})();
