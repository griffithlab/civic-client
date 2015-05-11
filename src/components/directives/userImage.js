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

    ctrl.hasAvatar = _.has(ctrl.user, 'avatar_url');
    console.log('has email: ' + ctrl.hasEmail);
  }

})();
