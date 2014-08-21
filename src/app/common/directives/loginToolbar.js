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
    templateUrl: 'common/directives/loginToolbar.tpl.html',
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

      $scope.items = [
        'The first choice!',
        'And another choice for you.',
        'but wait! A third!'
      ];

      $scope.status = {
        isopen: false
      };

      $scope.toggled = function(open) {
        $log.info('Dropdown is now: ', open);
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