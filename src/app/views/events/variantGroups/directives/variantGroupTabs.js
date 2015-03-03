(function() {
  'use strict';
  angular.module('civic.events')
    .directive('variantGroupTabs', variantGroupTabs);

  // @ngInject
  function variantGroupTabs(Security) {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/variantGroups/directives/variantGroupTabs.tpl.html',
      link: /* @ngInject */ function($scope) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
      }
    };

    return directive;
  }
})();
