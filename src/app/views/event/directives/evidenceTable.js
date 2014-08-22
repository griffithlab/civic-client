angular.module('civic.event')
  .directive('evidenceTable', evidenceTable);

// @ngInject
function evidenceTable() {
  'use strict';
  var directive = {
    restrict: 'E',
    templateUrl: 'views/event/directives/evidenceTable.tpl.html',
    replace: true,
    scope: true,
    link: function($scope) {
      console.log('evidenceTable linked.');
    }
  };

  return directive;
}