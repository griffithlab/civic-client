(function() {
  'use strict';
  angular.module('civic.events')
    .directive('geneTabs', geneTabs);

  // @ngInject
  function geneTabs(Security, $state) {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/genes/directives/geneTabs.tpl.html',
      link: function($scope) {
        console.log('geneTabs linked.');
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
      }
    };

    return directive;
  }
})();
