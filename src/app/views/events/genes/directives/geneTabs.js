(function() {
  'use strict';
  angular.module('civic.events')
    .directive('geneTabs', geneTabs);

  // @ngInject
  function geneTabs() {
    var directive = {
      restrict: 'E',
      scope: {
        gene: '=gene'
      },
      replace: true,
      templateUrl: 'app/views/events/genes/directives/geneTabs.tpl.html',
      controller: /* @ngInject */ function($scope, $state, Security){
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
        $scope.$state = $state;
      }
    };

    return directive;
  }
})();
