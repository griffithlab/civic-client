(function() {
  'use strict';
  angular.module('civic.services')
    .factory('StatsResource', StatsResource)
    .factory('Stats', StatsService);

  // @ngInject
  function StatsResource($resource) {

    return $resource('', {}, {
      site: {
        url: '/api/stats/site',
        method: 'GET',
        isArray: false,
        cache: false
      },
      user: {
        url: '/api/users/:userId/stats',
        params: {
          userId: '@userId'
        },
        method: 'GET',
        isArray: false,
        cache: false
      },
      organization: {
        url: '/api/organizations/:organizationId/stats',
        params: {
          organizationId: '@organizationId'
        },
        method: 'GET',
        isArray: false,
        cache: false
      },
      dashboard: {
        url: '/api/stats/dashboard',
        method: 'GET',
        isArray: false,
        cache: false
      }
    });
  }

  // @ngInject
  function StatsService(StatsResource) {
    var site = {};
    var user = {};
    var organization = {};
    var dashboard = {};

    return {
      data: {
        site: site,
        user: user,
        organization: organization,
        dashboard: dashboard
      },
      getSite: getSite,
      getUser: getUser,
      getOrganization: getOrganization,
      getDashboard: getDashboard
    };

    function getSite() {
      return StatsResource.site().$promise
        .then(function(response) {
          angular.copy(response, site);
          return response.$promise;
        });
    }

    function getUser(userId) {
      return StatsResource.user({
          userId: userId
        }).$promise
        .then(function(response) {
          angular.copy(response, user);
          return response.$promise;
        });
    }

    function getOrganization(organizationId) {
      return StatsResource.organization({
          organizationId: organizationId
        }).$promise
        .then(function(response) {
          angular.copy(response, organization);
          return response.$promise;
        });
    }

    function getDashboard(reqObj) {
      return StatsResource.dashboard(reqObj).$promise
        .then(function(response) {
          angular.copy(response, dashboard);
          return response.$promise;
        });
    }
  }
})();
