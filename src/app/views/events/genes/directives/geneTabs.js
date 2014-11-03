(function() {
  'use strict';
  angular.module('civic.events')
    .directive('geneTabs', geneTabs);

  // @ngInject
  function geneTabs(Security) {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: '/civic-client/views/events/genes/directives/geneTabs.tpl.html',
      link: function($scope) {
        console.log('geneTabs linked.');
        $scope.isAuthenticated = Security.isAuthenticated;
      }
    };

    return directive;
  }
})();