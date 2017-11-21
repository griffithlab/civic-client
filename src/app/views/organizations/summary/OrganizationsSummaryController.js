(function() {
  'use strict';
  angular.module('civic.organizations')
    .controller('OrganizationsSummaryController', OrganizationsSummaryController);

  // @ngInject
  function OrganizationsSummaryController($scope, organization, evidence_items, stats) {
    console.log('OrganizationsSummaryController called.');
    $scope.organization = organization;
    $scope.evidence_items = evidence_items.records;
    $scope.stats = stats;
    // vm.organization = organization;
    // vm.evidence_items = evidence_items.records;
    // vm.stats = stats;
  }
})();
