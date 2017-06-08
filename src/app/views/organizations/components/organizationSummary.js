(function() {
  'use strict';
  angular.module('civic.organizations')
    .controller('OrganizationSummaryController', OrganizationSummaryController)
    .directive('organizationSummary', function() {
      return {
        restrict: 'E',
        scope: {
          organization: '='
        },
        controller: 'OrganizationSummaryController',
        templateUrl: 'app/views/organizations/components/organizationSummary.tpl.html'
      };
    });

  // @ngInject
  function OrganizationSummaryController($scope, Stats) {
    var vm = $scope.vm = {};

    Stats.organization($scope.organization.id).then(function(stats) {
      vm.stats = stats;
    });
  }
})();
