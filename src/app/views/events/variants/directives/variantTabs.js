(function() {
  'use strict';
  angular.module('civic.events')
    .directive('variantTabs', variantTabs);

  // @ngInject
  function variantTabs() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/variants/directives/variantTabs.tpl.html',
      controller: /* @ngInject */ function($scope, $state, Security) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
        $scope.$state = $state;
      }
    };

    return directive;
  }
})();
