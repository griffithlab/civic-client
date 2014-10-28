(function() {
  'use strict';
  angular.module('civic.events')
    .directive('geneSummary', geneSummary);

// @ngInject
  function geneSummary() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: '/civic-client/views/events/genes/directives/geneSummary.tpl.html',
      link: function($scope) {
        console.log('geneSummary linked.');
      }
    };

    return directive;
  }
})();