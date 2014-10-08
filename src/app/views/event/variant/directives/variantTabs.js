(function() {
  'use strict';
  angular.module('civic.event')
    .directive('variantTabs', variantTabs);

// @ngInject
  function variantTabs(Security) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: false,
      templateUrl: '/civic-client/views/event/variant/directives/variantTabs.tpl.html',
      link: function($scope, $element, $attrs) {
        console.log('variantTabs linked.');
        $scope.isAuthenticated = Security.isAuthenticated;
      }
    };

    return directive;
  }
})();