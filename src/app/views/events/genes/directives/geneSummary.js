(function() {
  'use strict';
  angular.module('civic.events')
    .directive('geneSummary', geneSummary);

// @ngInject
  function geneSummary() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/genes/directives/geneSummary.tpl.html'
    };

    return directive;
  }
})();
