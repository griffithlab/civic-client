(function() {
  'use strict';
  angular.module('civic.events')
    .directive('evidenceTabs', evidenceTabs)
    .controller('EvidenceTabsCtrl', EvidenceTabsCtrl);

  // @ngInject
  function evidenceTabs() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/evidence/directives/evidenceTabs.tpl.html',
      controller: EvidenceTabsCtrl
    };
    return directive;
  }

  // @ngInject
  function EvidenceTabsCtrl($scope, $state, Security) {
    $scope.isAuthenticated = Security.isAuthenticated;
    $scope.isAdmin = Security.isAdmin;
    $scope.$state = $state;
  }
})();
