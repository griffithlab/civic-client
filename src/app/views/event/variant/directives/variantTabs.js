(function() {
  'use strict';
  angular.module('civic.event')
    .directive('variantTabs', variantTabs);

// @ngInject
  function variantTabs() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: false,
      templateUrl: '/civic-client/views/event/variant/directives/variantTabs.tpl.html',
      link: function($scope, $element, $attrs) {
        console.log('variantTabs linked.');
      }
    };

    return directive;
  }
})();