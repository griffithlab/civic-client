(function() {
  'use strict';
  angular.module('civic.event')
    .directive('geneTabs', geneTabs);

// @ngInject
  function geneTabs(Security) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: false,
      templateUrl: '/civic-client/views/event/gene/directives/geneTabs.tpl.html',
      link: function($scope, $element, $attrs) {
        console.log('geneTabs linked.');
        $scope.isAuthenticated = Security.isAuthenticated;
      }
    };

    return directive;
  }
})();