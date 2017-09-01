(function() {
  'use strict';
  angular.module('civic.assertions')
    .controller('AssertionsSummaryController', AssertionsSummaryController);

  // @ngInject
  function AssertionsSummaryController($scope, _, Security, assertion) {
    console.log('AssertionsSummaryController called.');
    var vm = $scope.vm = {};

    vm.isEditor = Security.isEditor();
    vm.isAdmin = Security.isAdmin();

    vm.assertion = assertion;
  }
})();
