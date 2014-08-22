angular.module('civic.event')
  .directive('geneSummary', geneSummary);

// @ngInject
function geneSummary() {
  'use strict';
  var directive = {
    restrict: 'E',
    templateUrl: 'views/event/directives/geneSummary.tpl.html',
    replace: true,
    scope: true,
    link: function($scope) {
      console.log('geneSummary linked.');
    }
  };

  return directive;
}