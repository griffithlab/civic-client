(function() {
  'use strict';
  angular.module('civic.events')
    .directive('variantSummary', variantSummary);

// @ngInject
  function variantSummary(Security) {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/variants/directives/variantSummary.tpl.html',
      link: /* ngInject */ function($scope) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
        $scope.login = Security.showLogin;
      }
    };

    return directive;
  }
})();
