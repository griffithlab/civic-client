(function() {
  'use strict';
  angular.module('civic.event')
    .directive('variantSummary', evidenceTable);

// @ngInject
  function evidenceTable() {
    var directive = {
      restrict: 'E',
      templateUrl: '/civic-client/views/event/variant/directives/variantSummary.tpl.html',
      controller: 'EventCtrl',
      replace: true,
      scope: true,
      link: function($scope) {
        console.log('variantSummary linked.');
      }
    };

    return directive;
  }
})();