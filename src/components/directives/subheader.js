(function () {
  'use strict';
  angular.module('civic.common')
    .directive('subheader', subheader)
    .controller('SubheaderCtrl', SubheaderCtrl);

  // @ngInject
  function subheader(Security) {
    var directive = {
      restrict: 'E',
      scope: true,
      templateUrl: 'components/directives/subheader.tpl.html',
      controller: SubheaderCtrl,
      link: /* @ngInject */ function($scope) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isEditor = Security.isAuthenticated;
      }
    };
    return directive;
  }

  // @ngInject
  function SubheaderCtrl($scope, $rootScope, $stateParams, Security) {
    $scope.isAuthenticated = Security.isAuthenticated;
    $scope.isEditor = Security.isAuthenticated;

    $rootScope.$on('title:update', function(event, data) {
      $scope.view.stateTitle = data.newTitle;
    });
  }
})();
