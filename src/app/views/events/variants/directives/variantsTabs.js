(function() {
  'use strict';
  angular.module('civic.events')
    .directive('variantsTabs', variantsTabs);

  // @ngInject
  function variantsTabs() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: '/civic-client/views/events/variants/directives/variantsTabs.tpl.html',
      link: function($scope) {
        console.log('variantsTabs directive linked.');
      }
    };

    return directive;
  }
})();