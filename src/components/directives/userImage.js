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
        width: '@'
      },
      templateUrl: 'components/directives/userImage.tpl.html',
      controller: 'UserImageController'
    }
  }

  // @ngInject
  function UserImageController($scope, Security) {
    var ctrl = $scope.ctrl = {};
    ctrl.height = $scope.height;
    ctrl.width = $scope.width;
    ctrl.currentUser = Security.currentUser;
  }

})();
