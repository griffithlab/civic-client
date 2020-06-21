(function() {
  'use strict';
  angular.module('civic.organizations')
    .controller('OrganizationsSummaryController', OrganizationsSummaryController);

  // @ngInject
  function OrganizationsSummaryController($scope, Search, organization, stats) {
    console.log('OrganizationsSummaryController called.');
    $scope.organization = organization;
    $scope.stats = stats;

    var query = {
      'entity': 'evidence_items',
      'operator': 'AND',
      'save': false,
      'queries': [{
        'field': 'organization_id',
        'condition': {
          'name': 'is_equal_to',
          'parameters': [$scope.organization.id]
        }
      }],
      'grid-view': true
    };

    Search.post(query).then(
      function(response) {
        $scope.evidence = response.results;
      },
      function() {
        console.log('User has no events events associated with their profile.');
        $scope.evidence = [];
      });

  }
})();
