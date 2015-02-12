(function() {
  'use strict';
  angular.module('civic.events')
    .directive('geneTabs', geneTabs);

  // @ngInject
  function geneTabs(Security) {
    var directive = {
      restrict: 'E',
      scope: {
        gene: '=gene'
      },
      replace: true,
      templateUrl: 'app/views/events/genes/directives/geneTabs.tpl.html',
      link: /* ngInject */ function($scope) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
      }
    };

    return directive;
  }
})();
