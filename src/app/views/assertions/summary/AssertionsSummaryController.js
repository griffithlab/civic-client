(function() {
  'use strict';
  angular.module('civic.assertions')
    .controller('AssertionsSummaryController', AssertionsSummaryController);

  // @ngInject
  function AssertionsSummaryController($scope, $log, _, Security, Assertions, assertion, myVariantInfo) {
    console.log('AssertionsSummaryController called.');
    var vm = $scope.vm = {};

    vm.isEditor = Security.isEditor();
    vm.isAdmin = Security.isAdmin();

    vm.assertion = assertion;
    vm.myVariantInfo = myVariantInfo;

    if(Security.currentUser) {
      var currentUserId = Security.currentUser.id;
      var submitterId = _.isUndefined(vm.assertion.lifecycle_actions.submitted) ? null : vm.assertion.lifecycle_actions.submitted.user.id;
      vm.ownerIsCurrentUser = submitterId === currentUserId;
    } else {
      vm.ownerIsCurrentUser = false;
    }

    $scope.acceptItem = function(id) {
      $log.debug('accept item ' + id);
      Assertions.accept(id)
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
      Assertions.reject(id)
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
