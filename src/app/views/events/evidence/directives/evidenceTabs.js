(function() {
  'use strict';
  angular.module('civic.events')
    .directive('evidenceTabs', evidenceTabs);

  // @ngInject
  function evidenceTabs(Security) {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: '/civic-client/views/events/evidence/directives/evidenceTabs.tpl.html',
      link: function($scope) {
        console.log('geneTabs linked.');
        $scope.isAuthenticated = Security.isAuthenticated;
      }
    };

    return directive;
  }
})();