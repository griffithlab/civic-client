(function() {
  'use strict';
  angular.module('civic.organizations')
    .controller('OrganizationsSummaryController', OrganizationsSummaryController);

  // @ngInject
  function OrganizationsSummaryController($scope, _, Security, organization, evidence_items) {
    console.log('OrganizationsSummaryController called.');
    var vm = $scope.vm = {};

    vm.isEditor = Security.isEditor();
    vm.isAdmin = Security.isAdmin();

    vm.organization = organization;
    vm.evidence_items = evidence_items.records;
  }
})();
