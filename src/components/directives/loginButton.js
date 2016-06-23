(function() {
  'use strict';
  angular.module('civic.security.login.toolbar')
    .directive('loginButton', loginButton);

  // @ngInject
  function loginButton() {

    var directive = {
      templateUrl: 'components/directives/loginButton.tpl.html',
      restrict: 'E',
      replace: true,
      scope: true,
      controller: /* @ngInject */ function($scope,
                                           $rootScope,
                                           $location,
                                           _,
                                           Security,
                                           ConfigService) {
        $scope.adminUrl = ConfigService.serverUrl + 'admin';
        $scope.isEditor = Security.isEditor;
        $scope.logout = Security.logout;
        $scope.showLogin = Security.showLogin;

        $scope.$watch(function() {
          return Security.currentUser;
        }, function(currentUser) {
          if(!_.isNull(currentUser)) {
            $scope.currentUser = currentUser;
            $scope.totalNotifications = _.reduce(currentUser.unread_notifications, function (acc, value) {
              return acc + value;
            });
            $scope.hasNotifications = $scope.totalNotifications > 0;
          }
        });

        $scope.status = {
          isopen: false
        };

        $scope.toggleDropdown = function($event) {
          $event.preventDefault();
          $event.stopPropagation();
          $scope.status.isopen = !$scope.status.isopen;
        };

        if(!$scope.currentUrl) { $scope.currentUrl = $location.url(); }
        $rootScope.$on('$stateChangeSuccess', function() {
          $scope.currentUrl = $location.url();
        });
      }
    };
    return directive;
  }
})();
