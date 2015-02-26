(function() {
  'use strict';
  angular.module('civic.events')
    .directive('variantGroupSummary', variantGroupSummary);

  // @ngInject
  function variantGroupSummary(Security) {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/variantGroups/directives/variantGroupSummary.tpl.html',
      link: /* @ngInject */ function($scope, $log) {
        console.info('-------- variantGroupSummary linked.');
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
      }
    };

    return directive;
  }
})();
