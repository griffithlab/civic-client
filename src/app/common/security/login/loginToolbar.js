angular.module('civic.security.login.toolbar', [])
  .directive('loginToolbar', loginToolbar);

/**
 * @name loginToolbar
 * @desc The loginToolbar directive is a reusable widget that can show login or logout
 * buttons and information the current authenticated user
 * @param SecurityService
 * @returns {{templateUrl: string, restrict: string, replace: boolean, scope: boolean, link: link}}
 * @ngInject
 */
function loginToolbar(SecurityService) {
  var directive = {
    templateUrl: 'common/security/login/loginToolbar.tpl.html',
    restrict: 'E',
    replace: true,
    scope: true,
    link: function($scope, $element, $attrs, $controller) {
      $scope.isAuthenticated = SecurityService.isAuthenticated;
      $scope.login = SecurityService.showLogin;
      $scope.logout = SecurityService.logout;
      $scope.$watch(function() {
        return SecurityService.currentUser;
      }, function(currentUser) {
        $scope.currentUser = currentUser;
      });
    }
  };
  return directive;
}