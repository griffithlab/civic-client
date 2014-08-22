angular.module('civic.event')
  .directive('eventSummary', evidenceTable);

// @ngInject
function evidenceTable() {
  'use strict';
  var directive = {
    restrict: 'E',
    templateUrl: 'views/event/directives/eventSummary.tpl.html',
    replace: true,
    scope: true,
    link: function($scope) {
      console.log('eventSummary linked.');
    }
  };

  return directive;
}