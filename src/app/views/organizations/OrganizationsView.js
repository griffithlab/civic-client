(function() {
  'use strict';
  angular.module('civic.organizations')
    .config(organizationsConfig);

  // @ngInject
  function organizationsConfig($stateProvider) {
    $stateProvider
      .state('organizations', {
        abstract: true,
        url: '/organizations/:organizationId',
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
          organization: function($stateParams, Organizations) {
            return Organizations.get($stateParams.organizationId);
          }
        }
      });
  }

})();
