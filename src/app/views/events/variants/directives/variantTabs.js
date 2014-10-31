(function() {
  'use strict';
  angular.module('civic.events')
    .directive('variantTabs', variantTabs);

  // @ngInject
  function variantTabs() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: '/civic-client/views/events/variants/directives/variantTabs.tpl.html',
      link: function($scope) {
        console.log('variantsTabs directive linked.');
      }
    };

    return directive;
  }
})();