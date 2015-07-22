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

  function UserSummaryController() {
    console.log('UserSummaryController called.');
  }
})();
