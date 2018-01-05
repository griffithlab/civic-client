(function() {
  'use strict';
  angular.module('civic.assertions')
    .controller('AssertionsSummaryController', AssertionsSummaryController);

  // @ngInject
  function AssertionsSummaryController($scope, _, Security, Assertions, assertion, myVariantInfo) {
    console.log('AssertionsSummaryController called.');
    var vm = $scope.vm = {};

    vm.isEditor = Security.isEditor();
    vm.isAdmin = Security.isAdmin();

    vm.assertion = assertion;
    vm.myVariantInfo = myVariantInfo;

    $scope.acceptItem = function(id) {
      $log.debug('accept item ' + id);
      Assertions.accept(id, $stateParams.variantId)
        .then(function(response) {
          $log.debug('Accept success.');
          $log.debug(response);
        })
        .catch(function(response) {
          $log.error('Ooops! There was an error accepting this evidence item.');
          $log.error(response);
        })
        .finally(function() {
          $log.debug('Accept Item done.');
        });
    };

    $scope.rejectItem = function(id) {
      $log.debug('reject item ' + id);
      Assertions.reject(id, $stateParams.variantId)
        .then(function(response) {
          $log.debug('Reject success.');
          $log.debug(response);
        })
        .catch(function(response) {
          $log.error('Ooops! There was an error rejecting this evidence item.');
          $log.error(response);
        })
        .finally(function() {
          $log.debug('Reject Item done.');
        });
    };
  }
})();
