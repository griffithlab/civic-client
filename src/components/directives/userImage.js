(function() {
  'use strict';
  angular.module('civic.common')
    .directive('userImage', userImageDirective)
    .controller('UserImageController', UserImageController);

  // @ngInject
  function userImageDirective() {
    return {
      restrict: 'E',
      scope: {
        height: '@',
        width: '@',
        user: '='
      },
      templateUrl: 'components/directives/userImage.tpl.html',
      controller: 'UserImageController'
    }
  }

  // @ngInject
  function UserImageController($scope) {
    var ctrl = $scope.ctrl = {};

    ctrl.height = $scope.height;
    ctrl.width = $scope.width;
    ctrl.user = $scope.user;

    ctrl.hasEmail = typeof ctrl.user === 'object' && _.has(ctrl.user, 'email') && ctrl.user.email.length != 0;
    console.log('has email: ' + ctrl.hasEmail);
  }

})();
