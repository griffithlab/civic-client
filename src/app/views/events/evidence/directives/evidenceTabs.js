(function() {
  'use strict';
  angular.module('civic.events')
    .directive('evidenceTabs', evidenceTabs);

  // @ngInject
  function evidenceTabs(Security) {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/evidence/directives/evidenceTabs.tpl.html',
      controller: /* ngInject */ function($scope) {
        $scope.isAuthenticated = Security.isAuthenticated;
      }
    };

    return directive;
  }
})();
