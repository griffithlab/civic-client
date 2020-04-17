(function() {
  'use strict';
  angular.module('civic.services')
    .factory('CurrentUserResource', CurrentUserResource)
    .factory('CurrentUser', CurrentUserService);

  // @ngInject
  function CurrentUserResource($resource, _) {

    var userOrgsInterceptor = function(response) {
      var user = response.data;
      if(_.isNull(user.most_recent_organization)) { // most_recent_org not defined
        if(!_.isEmpty(user.organizations)) { // is a member of at least one org
          // assign u.orgs[0] to most_recent_org
          user.most_recent_organization = user.organizations[0];
        } else { /* no orgs, most_recent remains null */ }
      } else { // most_recent_org is defined, ensure it's also present in user.orgs array
        var orgId = user.most_recent_organization.id;
        if (!_.some(user.organizations, { id: orgId })) { // user is not currently member of most_recent_org
          if(!_.isEmpty(user.organizations)) { // user is a member of at least one org
            user.most_recent_organization = user.organizations[0];
          } else { // user is not a member of their most_recent_org, assign null
            user.most_recent_organization = null;
          }
        }
      }
      return user;
    };

    return $resource('/api/current_user',
      {},
      {
        get: {
          method: 'GET',
          isArray: false,
          cache: false,
          interceptor: {
            response: userOrgsInterceptor
          }
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
        getCoiStatements: {
          url:'/api/current_user/conflict_of_interest_statements',
          isArray: true,
          cache: false
        },
        addCoiStatement: {
          method: 'POST',
          url:'/api/current_user/conflict_of_interest_statements',
          cache: false
        },
        markFeed: {
          method: 'PATCH',
          url: '/api/current_user/feed',
          isArray: false,
          cache: false
        },
        markAllAsRead: {
          method: 'PATCH',
          url: '/api/current_user/feed',
          isArray: false,
          cache: false
        },
        markAsRead: {
          method: 'PATCH',
          url: '/api/current_user/feed',
          isArray: false,
          cache: false
        },
        markAsUnread: {
          method: 'PATCH',
          url: '/api/current_user/feed',
          isArray: false,
          cache: false
        },

      }
    );
  }

  // @ngInject
  function CurrentUserService(CurrentUserResource, Security, _) {
    var user = {};
    var statements = [];
    var events = [];
    var stats = [];
    var feed = {
      records: [],
      _meta: {}
    };

    var mentions = [];

    return {
      data: {
        user: user,
        statements: statements,
        events: events,
        stats: stats,
        feed: feed,
        mentions: mentions
      },
      get: get,
      getStats: getStats,
      getEvents: getEvents,
      getFeed: getFeed,
      getCoiStatements: getCoiStatements,
      addCoiStatement: addCoiStatement,
      markAllAsRead: markAllAsRead,
      markFeed: markFeed
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
      _.forEach(reqObj, function(val, key) {
        if(_.isBoolean(val)) {
          reqObj[key] = String(val);
        }
      });
      return CurrentUserResource.getFeed(reqObj).$promise
        .then(function(response) {
          angular.copy(response, feed);
          return response.$promise;
        });
    }

    function getCoiStatements() {
      return CurrentUserResource.getCoiStatements().$promise
        .then(function(response) {
          angular.copy(response, statements);
          return response.$promise;
        });
    }

    function addCoiStatement(reqObj) {
      return CurrentUserResource.addCoiStatement(reqObj).$promise
        .then(function(response) {
          get();
          getCoiStatements();
          Security.reloadCurrentUser(); // required to update user button in header
          return response.$promise;
        });
    }

    function markAllAsRead(params) {
      _.forEach(params, function(val, key) {
        if(_.isBoolean(val)) {
          params[key] = String(val);
        }
      });
      var t = new Date().toISOString();
      return CurrentUserResource.markFeed(_.merge(params, { upto: t, read: true })).$promise
        .then(function(response) {
          angular.copy(response, feed);
          Security.reloadCurrentUser();
          return response.$promise;
        });
    }

    function markFeed(params, ids, read) {
      _.forEach(params, function(val,key) {
        if(_.isBoolean(val)) {
          params[key] = String(val);
        }
      });
      return CurrentUserResource.markFeed(_.merge(params, {notification_ids: ids, read: read })).$promise
        .then(function(response) {
          angular.copy(response, feed);
          Security.reloadCurrentUser();
          return response.$promise;
        });
    }
  }
})();
