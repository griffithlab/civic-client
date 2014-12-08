(function() {
  'use strict';
  angular.module('civic.events')
    .directive('variantSummary', variantSummary);

// @ngInject
  function variantSummary() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/variants/directives/variantSummary.tpl.html',
      link: /* ngInject */ function() {
        console.log('variantSummary directive linked.');
      }
    };

    return directive;
  }
})();
