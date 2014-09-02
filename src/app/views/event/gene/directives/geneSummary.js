angular.module('civic.event')
  .directive('geneSummary', geneSummary);

// @ngInject
function geneSummary() {
  'use strict';
  var directive = {
    restrict: 'E',
    replace: true,
    scope: true,
    controller: 'GeneCtrl',
    templateUrl: '/civic-client/views/event/gene/directives/geneSummary.tpl.html',
    link: function($scope, GeneCtrl) {
      console.log('geneSummary linked.');
    }
  };

  return directive;
}