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
          ur1l:'/api/current_user/stats',
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
        markAllAsRead: {
          method: 'PATCH',
          url: '/api/current_user/feed',
          isArray: false,
          cache: false
        }
      }
    );
  }

  // @ngInject
  function CurrentUserService(CurrentUserResource, _) {
    var user = {};
    var events = [];
    var stats = [];
    var feed = [];
    var unread = {};
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
      markAllAsRead: markAllAsRead
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

    function getFeed(reqObj) {
      return CurrentUserResource.getFeed(reqObj).$promise
        .then(function(response) {
          angular.copy(parseFeed(response), feed);
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

    function markAllAsRead() {
      var t = new Date().toISOString();
      return CurrentUserResource.markAllAsRead({ upto: t }).$promise
        .then(function(response) {
          var updated= parseFeed(response);
          var updatedIds = _.map(updated, 'id');

          _.forEach(feed, function(notification) {
            if(_.includes(updatedIds, notification.id)) {
              notification.seen = true;
            }
          });

          //angular.copy(parseFeed(response), feed);
          return response.$promise;
        })
    }

    function parseFeed(response) {
      var mentions = _.chain(response.notifications.mentions)
        .map(function(mention) { mention.type = 'mention'; return mention;})
        .sortBy('created_at')
        .reverse()
        .value();

      var subscribed_events = _.chain(response.notifications.subscribed_events)
        .map(function(evt) {
          var event = evt.event;
          event.type = 'subscribed_event';
          event.seen = evt.seen;
          event.created_at = evt.created_at;
          return event})
        .sortBy('created_at')
        .value();

      return _.chain(mentions)
        .concat(subscribed_events)
        .sortBy('created_at')
        .reverse()
        .value();
    }
  }
})();
