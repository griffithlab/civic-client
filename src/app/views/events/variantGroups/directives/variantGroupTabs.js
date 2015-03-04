(function() {
  'use strict';
  angular.module('civic.events')
    .directive('variantGroupTabs', variantGroupTabs);

  // @ngInject
  function variantGroupTabs() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/variantGroups/directives/variantGroupTabs.tpl.html',
      controller: /* @ngInject */ function($scope, $state, Security) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
        $scope.$state = $state;
      }
    };

    return directive;
  }
})();
