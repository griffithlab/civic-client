(function() {
  'use strict';
  angular.module('civic.events')
    .directive('variantTabs', variantTabs);

  // @ngInject
  function variantTabs(Security) {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: '/civic-client/views/events/variants/directives/variantTabs.tpl.html',
      link: function($scope) {
        console.log('variantTabs linked.');
        $scope.isAuthenticated = Security.isAuthenticated;
      }
    };

    return directive;
  }
})();