(function() {
  'use strict';
  angular.module('civic.events')
    .directive('variantSummary', variantSummary);

  // @ngInject
  function variantSummary() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: '/civic-client/views/events/variants/directives/variantSummary.tpl.html',
      link: function($scope) {
        console.log('variantSummary directive linked.');
      }
    };

    return directive;
  }
})();