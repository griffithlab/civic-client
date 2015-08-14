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
    vm.stats = {};

    Stats.user($scope.user.id).then(function(stats) {
      vm.stats = stats;
    });
  }
})();
