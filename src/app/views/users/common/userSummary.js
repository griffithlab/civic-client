(function() {
  'use strict';
  angular.module('civic.users')
    .controller('UserSummaryController', UserSummaryController)
    .directive('userSummary', function() {
      return {
        restrict: 'E',
        scope: {
          user: '='
        },
        controller: 'UserSummaryController',
        templateUrl: 'app/views/users/common/userSummary.tpl.html'
      };
    });

  // @ngInject
  function UserSummaryController($scope, Stats, Security) {
    var vm = $scope.vm = {};
    vm.currentUser= Security.currentUser;
    vm.showCoi = $scope.user.role === 'admin' || $scope.user.role === 'editor';

    // set COI notice display
    $scope.$watch(function() {
      return Security.currentUser;
    }, function(currentUser) {
      if(!_.isNull(currentUser)) {
        vm.currentUser = currentUser;
        vm.showCoiNotice = $scope.user.id === currentUser.id
          && (Security.isAdmin() || Security.isEditor())
          && (currentUser.conflict_of_interest.coi_valid === 'missing'
              || currentUser.conflict_of_interest.coi_valid === 'expired' );
      }
    });

    vm.stats = {};
    Stats.getUser($scope.user.id).then(function(stats) {
      vm.stats = stats;
    });
  }
})();
