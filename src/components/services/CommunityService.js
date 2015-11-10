(function() {
  'use strict';
  angular.module('civic.services')
    .factory('CommunityResource', CommunityResource)
    .factory('Community', CommunityService);

  // @ngInject
  function CommunityResource($resource) {
    //var cache = $cacheFactory.get('$http');

    //var cacheInterceptor = function(response) {
    //  console.log(['EvidenceResource: removing', response.config.url, 'from $http cache.'].join(' '));
    //  cache.remove(response.config.url);
    //  return response.$promise;
    //};


    return $resource('/api/community',
      {},
      {
        leaderboards: {
          url: '/api/community/leaderboards/',
          method: 'GET',
          isArray: false,
          cache: false
        }
      }
    );
  }

  // @ngInject
  function CommunityService(CommunityResource) {
    var leaderboards = { };

    return {
      data: {
        leaderboards: leaderboards
      },
      getLeaderboards: getLeaderboards
    };

    function getLeaderboards() {
      return CommunityResource.leaderboards().$promise
        .then(function(response) {
          angular.copy(response, leaderboards);
          return response.$promise;
        });
    }
  }
})();
