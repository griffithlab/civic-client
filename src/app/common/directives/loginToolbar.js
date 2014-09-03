(function() {
  angular.module('civic.security.login.toolbar', [])
    .directive('loginToolbar', loginToolbar);

  /**
   * @name loginToolbar
   * @desc The loginToolbar directive is a reusable widget that can show login or logout
   * buttons and information the current authenticated user
   * @param Security
   * @returns {{templateUrl: string, restrict: string, replace: boolean, scope: boolean, link: link}}
   * @ngInject
   */
  function loginToolbar(Security, $log) {
    'use strict';
    var directive = {
      templateUrl: '/civic-client/common/directives/loginToolbar.tpl.html',
      restrict: 'E',
      replace: true,
      scope: true,
      link: function($scope) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.login = Security.showLogin;
        $scope.logout = Security.logout;
        $scope.$watch(function() {
          return Security.currentUser;
        }, function(currentUser) {
          $scope.currentUser = currentUser;
        });
        $scope.status = {
          isopen: false
        };

        $scope.toggleDropdown = function($event) {
          $event.preventDefault();
          $event.stopPropagation();
          $scope.status.isopen = !$scope.status.isopen;
        };
      }
    };
    return directive;
  }
})();