(function() {
  'use strict';
  angular.module('civic.services')
    .factory('CurrentUserResource', CurrentUserResource)
    .factory('CurrentUser', CurrentUserService);

  // @ngInject
  function CurrentUserResource($resource) {
    //var cache = $cacheFactory.get('$http');

    //var cacheInterceptor = function(response) {
    //  console.log(['EvidenceResource: removing', response.config.url, 'from $http cache.'].join(' '));
    //  cache.remove(response.config.url);
    //  return response.$promise;
    //};


    return $resource('/api/current_user',
      {},
      {
        get: {
          method: 'GET',
          isArray: false,
          cache: false
        },
        getStats: {
          url:'/api/current_user/stats',
          isArray: false,
          cache: false
        },
        getEvents: {
          url:'/api/current_user/events',
          isArray: false,
          cache: false
        },
        getFeed: {
          url:'/api/current_user/feed',
          isArray: false,
          cache: false
        },
        getUnread: {
          url:'/api/current_user/unread_feed',
          isArray: false,
          cache: false
        },
        getMentions: {
          url:'/api/current_user/mentions',
          isArray: true,
          cache: false
        }
      }
    );
  }

  // @ngInject
  function CurrentUserService(CurrentUserResource) {
    var user = {};
    var events = [];
    var stats = [];
    var feed = [];
    var unread = [];
    var mentions = [];

    return {
      data: {
        user: user,
        events: events,
        stats: stats,
        feed: feed,
        unread: unread,
        mentions: mentions
      },
      get: get,
      getStats: getStats,
      getEvents: getEvents,
      getFeed: getFeed,
      getUnread: getUnread,
      getMentions: getMentions
    };

    function get() {
      return CurrentUserResource.get().$promise
        .then(function(response) {
          angular.copy(response, user);
          return response.$promise;
        });
    }

    function getStats() {
      return CurrentUserResource.getStats().$promise
        .then(function(response) {
          angular.copy(response, stats);
          return response.$promise;
        });
    }

    function getEvents() {
      return CurrentUserResource.getEvents().$promise
        .then(function(response) {
          angular.copy(response, stats);
          return response.$promise;
        });
    }

    function getFeed() {
      return CurrentUserResource.getFeed().$promise
        .then(function(response) {
          angular.copy(response, feed);
          return response.$promise;
        });
    }

    function getUnread() {
      return CurrentUserResource.getUnread().$promise
        .then(function(response) {
          angular.copy(response, unread);
          return response.$promise;
        });
    }

    function getMentions() {
      return CurrentUserResource.getMentions().$promise
        .then(function(response) {
          angular.copy(response, mentions);
          return response.$promise;
        });
    }
  }
})();
