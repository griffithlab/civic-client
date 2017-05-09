(function() {
  'use strict';
  angular.module('civic.organizations')
    .config(organizationsConfig);

  // @ngInject
  function organizationsConfig($stateProvider) {
    $stateProvider
      .state('organizations', {
        abstract: true,
        url: '/organizations/:organizationsId',
        template: '<ui-view id="organizations-view"></ui-view>',
        data: {
          titleExp: '"Organizations"',
          navMode: 'sub'
        }
      })
      .state('organizations.summary', {
        url: '/summary',
        templateUrl: 'app/views/organizations/summary/organizationsSummary.tpl.html',
        controller: 'OrganizationsSummaryController',
        data: {
          titleExp: '"Organization Summary"',
          navMode: 'sub'
        },
        resolve: {
          source: function($stateParams, Organizations) {
            return Organizations.get($stateParams.organizationsId);
          },
          comments: function($stateParams, Organizations) {
            return Organizations.queryComments($stateParams.organizationsId);
          }
        }
      });
  }

})();
