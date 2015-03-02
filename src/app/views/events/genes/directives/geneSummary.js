(function() {
  'use strict';
  angular.module('civic.events')
    .directive('geneSummary', geneSummary);

// @ngInject
  function geneSummary(Security) {
    var directive = {
      restrict: 'E',
      scope: {
        'gene': '=gene',
        'geneDetails': '=geneDetails'
      },
      replace: true,
      templateUrl: 'app/views/events/genes/directives/geneSummary.tpl.html',
      link: /* ngInject */ function($scope) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
        $scope.login = Security.showLogin;
      }
    };

    return directive;
  }
})();
